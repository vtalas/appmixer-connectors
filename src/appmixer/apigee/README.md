# Apigee Connector

## Architecture Overview

![architecture.png](architecture.png)

## Directory Structure

```
apigee/
├── artifacts/              # Shared Flow bundle artifacts
├── core/                   # Core Apigee components
└── blocking-ip-shared-flow/ # IP blocking Shared Flow implementation
```

## Shared Flow Bundle

### Policies Overview

This Shared Flow implements IP blocking functionality using a series of policies that check incoming requests against a blocked IP list and trigger appropriate error responses when matches are detected.

### Execution Flow

The `default.xml` configuration file orchestrates the following execution sequence:

1. **JS-set-kvm-key.js** - Calculates the Key-Value Map (KVM) lookup key for the IP group. IP addresses are organized into multiple groups as defined by the `NUM_OF_IP_GROUPS` variable (used in both `BlockIps.js` and `set-kvm-key.js`). By default, 500 groups are configured for optimal distribution.

2. **KVM-Get-Dynamic** - Fetches the corresponding IP group data from the KVM using the key calculated in the previous step.

3. **JS-ip-blocking-policy.js** - Checks whether the incoming request's IP address exists in the blocked IP list.

4. **RF-IP-Blocked** - Returns a 403 Forbidden HTTP response if the IP address is found on the blocked list.

## Building the Bundle

To generate a new Shared Flow bundle, run:

```bash
npm install
npm run bundle
```
