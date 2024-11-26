# Get the contract address as a command line argument
CONTRACT_ADDRESS=$1
ACCOUNT_ADDRESS=$(cat $STARKNET_ACCOUNT | jq -r .deployment.address)
FE_ADDRESS=0x03dab0cc9d86baff214b440b6bf322806685a2242c3a7adf865b11ca19754a69

# Add admin
starkli invoke $CONTRACT_ADDRESS add_admin $FE_ADDRESS

# Set the address as allowed.
starkli invoke $CONTRACT_ADDRESS add_allowed_user $ACCOUNT_ADDRESS
starkli invoke $CONTRACT_ADDRESS add_allowed_user $FE_ADDRESS

# Add events, inputs are time and price.
# Monday, 25 November 2024 12:00:00
starkli invoke $CONTRACT_ADDRESS add_event 1732528800 10 
# Tuesday, 26 November 2024 12:00:00
starkli invoke $CONTRACT_ADDRESS add_event 1732615200 10
# Wednesday, 27 November 2024 12:00:00
starkli invoke $CONTRACT_ADDRESS add_event 1732701600 10
# Wednesday, 27 November 2024 13:00:00, two events in the same day.
starkli invoke $CONTRACT_ADDRESS add_event 1732705200 10
# Monday, 2 December 2024 12:00:00
starkli invoke $CONTRACT_ADDRESS add_event 1733133600 10
# Tuesday, 3 December 2024 12:00:00
starkli invoke $CONTRACT_ADDRESS add_event 1733220000 10
# Wednesday, 4 December 2024 12:00:00
starkli invoke $CONTRACT_ADDRESS add_event 1733306400 10