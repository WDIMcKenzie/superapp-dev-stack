# Oracle Cloud (OCI) hosting playbook

## When to choose

- Oracle stack mandate
- Autonomous DB on OCI

## Setup

1. Tenancy `{{OCI_TENANCY}}`
2. Compute instance or OKE cluster
3. Autonomous DB — see [oracle-databases.md](../../databases/oracle-databases.md)

## Workflow

Same staging → prod gates as other clouds.

## Agent notes

Tier C — wallet and NSG setup is human-led.
