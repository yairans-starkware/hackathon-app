// TODO: Make upgradable.
// TODO: Add events.

use starknet::ContractAddress;

#[derive(Drop, Serde, starknet::Store)]
struct EventInfo {
    time: felt252,
}

#[derive(Drop, Serde)]
struct EventUserInfo {
    id: usize,
    time: felt252,
    registered: bool,
    canceled: bool,
}

#[starknet::interface]
trait IRegistration<T> {
    fn get_events(self: @T, user: ContractAddress, max_n_events: usize) -> Array<EventUserInfo>;

    fn register(ref self: T, event_id: felt252);
    fn unregister(ref self: T, event_id: felt252);

    fn acquire_tokens(ref self: T, amount: u32);
    fn balanceOf(self: @T, user: ContractAddress) -> u32;

    fn add_event(ref self: T, time: felt252);
    fn modify_event_time(ref self: T, event_id: felt252, time: felt252);
    fn set_event_canceled(ref self: T, event_id: felt252, canceled: bool);
    fn add_allowed_user(ref self: T, user: ContractAddress);
    fn remove_allowed_user(ref self: T, user: ContractAddress);
}

#[starknet::contract]
mod registration {
    use starknet::storage::StorageMapReadAccess;
    use starknet::storage::StoragePointerWriteAccess;
    use starknet::storage::StoragePointerReadAccess;
    use starknet::storage::StorageMapWriteAccess;
    use super::{EventInfo, EventUserInfo};
    use starknet::ContractAddress;
    use starknet::storage::Map;

    #[storage]
    struct Storage {
        events: Map<felt252, EventInfo>,
        event_canceled: Map<felt252, bool>,
        n_events: usize,
        // A map from user to their token balance.
        balance: Map<ContractAddress, u32>,
        // A set of users who may request tokens.
        allowed_users: Map<ContractAddress, bool>,
        // A map from (event_id, user) to whether the user is registered to the event.
        is_registered_to_event: Map<(felt252, ContractAddress), bool>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        UserRegistration: UserRegistration,
        EventChanged: EventChanged,
        EventCancellation: EventCancellation,
        AcquireTokens: AcquireTokens,
        UserAllowed: UserAllowed,
    }

    // A user registered/unregistered to event.
    #[derive(Drop, starknet::Event)]
    struct UserRegistration {
        #[key]
        user: ContractAddress,
        #[key]
        event_id: felt252,
        status: bool,
    }

    #[derive(Drop, starknet::Event)]
    struct EventChanged {
        event_id: felt252,
        time: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct EventCancellation {
        event_id: felt252,
        canceled: bool,
    }

    #[derive(Drop, starknet::Event)]
    struct AcquireTokens {
        user: ContractAddress,
        amount: u32,
        new_balance: u32,
    }

    #[derive(Drop, starknet::Event)]
    struct UserAllowed {
        user: ContractAddress,
        allowed: bool,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {}

    #[generate_trait]
    impl PrivateFunctionsImpl of PrivateFunctions {
        fn _add_event(ref self: ContractState, time: felt252) {
            let n_events = self.n_events.read();
            self.events.write(n_events.into(), EventInfo { time });
            self.n_events.write(n_events + 1);

            self.emit(EventChanged { event_id: n_events.into(), time });
        }

        fn _modify_event_time(ref self: ContractState, event_id: felt252, time: felt252) {
            self._check_event_exists(event_id);
            // TODO: Check not cancelled.
            self.events.write(event_id, EventInfo { time });

            self.emit(EventChanged { event_id, time });
        }

        fn _check_event_exists(self: @ContractState, event_id: felt252) {
            assert(
                event_id.try_into().expect('Invalid event_id') < self.n_events.read(),
                'Event does not exist.'
            );
        }

        fn _check_not_canceled(self: @ContractState, event_id: felt252) {
            self._check_event_exists(event_id);
            assert(!self.event_canceled.read(event_id), 'Event canceled.');
        }

        fn _register_user_to_event(
            ref self: ContractState, event_id: felt252, user: ContractAddress
        ) {
            self._check_not_canceled(event_id);
            // let event_time: u256 = self.events.read(event_id).time.into();
            // assert(event_time < starknet::get_block_timestamp().into(), 'Event already
            // started.');
            assert(!self.is_registered_to_event.read((event_id, user)), 'User already registered.');
            self.is_registered_to_event.write((event_id, user), true);

            self.emit(UserRegistration { user, event_id, status: true });
        }

        fn _unregister_user_from_event(
            ref self: ContractState, event_id: felt252, user: ContractAddress
        ) {
            self._check_event_exists(event_id);
            // let canceled = self.event_canceled.read(event_id);
            // let event_time: u256 = self.events.read(event_id).time.into();
            // assert(event_time < starknet::get_block_timestamp().into(), 'Event already
            // started.');
            assert(self.is_registered_to_event.read((event_id, user)), 'User not registered.');
            self.is_registered_to_event.write((event_id, user), false);

            self.emit(UserRegistration { user, event_id, status: false });
        }
    }

    // TODO: Remove.
    // #[abi(embed_v0)]
    // #[generate_trait]
    // impl TestFunctionsImpl of TestFunctions {
    // }

    #[abi(embed_v0)]
    impl RegistrationImpl of super::IRegistration<ContractState> {
        fn get_events(
            self: @ContractState, user: ContractAddress, max_n_events: usize
        ) -> Array<EventUserInfo> {
            let mut events = ArrayTrait::new();
            let total_n_events = self.n_events.read();

            if (total_n_events == 0) {
                return events;
            }

            let mut index = total_n_events;
            let mut cnt = 0;

            while index > 0 && cnt < max_n_events {
                index -= 1;
                let event = self.events.read(index.into());
                let canceled = self.event_canceled.read(index.into());
                let registered = self.is_registered_to_event.read((index.into(), user));

                if canceled && !registered {
                    continue;
                }

                let event_user_info = EventUserInfo {
                    id: index, time: event.time, registered, canceled,
                };
                cnt += 1;
                events.append(event_user_info);
            };
            events
        }

        fn add_event(ref self: ContractState, time: felt252) {
            // TODO: Check owner.
            self._add_event(time);
        }

        fn modify_event_time(ref self: ContractState, event_id: felt252, time: felt252) {
            // TODO: Check owner.
            self._modify_event_time(event_id, time);
        }

        fn set_event_canceled(ref self: ContractState, event_id: felt252, canceled: bool) {
            // TODO: Check owner.
            self._check_event_exists(event_id);
            self.event_canceled.write(event_id, canceled);

            self.emit(EventCancellation { event_id, canceled });
        }

        fn add_allowed_user(ref self: ContractState, user: ContractAddress) {
            // TODO: Check owner.
            assert(!self.allowed_users.read(user), 'User already registered.');
            self.allowed_users.write(user, true);

            self.emit(UserAllowed { user, allowed: true });
        }

        fn remove_allowed_user(ref self: ContractState, user: ContractAddress) {
            // TODO: Check owner.
            assert(self.allowed_users.read(user), 'User not registered.');
            self.allowed_users.write(user, false);

            self.emit(UserAllowed { user, allowed: false });
        }

        fn register(ref self: ContractState, event_id: felt252) {
            let user = starknet::get_caller_address();

            // Check and update balance.
            let current_balance = self.balance.read(user);
            assert(current_balance >= 1, 'Insufficient balance.');
            self.balance.write(user, current_balance - 1);

            self._register_user_to_event(:event_id, :user);
        }

        fn unregister(ref self: ContractState, event_id: felt252) {
            let user = starknet::get_caller_address();
            self._unregister_user_from_event(:event_id, :user);

            let current_balance = self.balance.read(user);
            // In this case we don't check that balance is not too high.
            self.balance.write(user, current_balance + 1);
        }

        fn acquire_tokens(ref self: ContractState, amount: u32) {
            let user = starknet::get_caller_address();

            assert(self.allowed_users.read(user), 'User not registered.');

            let current_balance = self.balance.read(user);
            let new_balance = current_balance + amount;
            // TODO: Check + check overflow.
            assert(new_balance <= 12, 'balance exceeds 12 tokens.');
            self.balance.write(user, new_balance);

            self.emit(AcquireTokens { user, amount, new_balance });
        }

        fn balanceOf(self: @ContractState, user: ContractAddress) -> u32 {
            self.balance.read(user)
        }
    }
}
