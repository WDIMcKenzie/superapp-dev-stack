# Your projects

Each app you create with `pnpm run init` lives in **its own folder** here:

```
projects/
└── <app-slug>/
    ├── apps/web-local/
    ├── services/api/
    ├── packages/
    ├── team/
    ├── .superapp/
    └── .env.local
```

This folder is **gitignored** (except this README) so your apps stay private on your machine.

To use a different workspace, run `pnpm run init` and choose **Custom workspace folder**.
