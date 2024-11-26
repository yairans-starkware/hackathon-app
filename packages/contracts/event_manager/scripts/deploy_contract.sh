set -e

# Assuming a starkli account configuration file is present in $STARKNET_ACCOUNT.
ACCOUNT_ADDRESS=$(cat $STARKNET_ACCOUNT | jq -r .deployment.address)

scarb build
starkli declare ~/workspace/catering/packages/contracts/event_manager/target/dev/event_manager_registration.contract_class.json
CLASS_HASH=$(starkli class-hash ~/workspace/catering/packages/contracts/event_manager/target/dev/event_manager_registration.contract_class.json)
# Prevent "contract not declared" error when deploying.
sleep 10
starkli deploy $CLASS_HASH $ACCOUNT_ADDRESS
