# Rename the documentation build script

## Goal

Replace the root `deploy:build` npm script with `docs` throughout the repository. The new
`npm run docs` command must preserve the existing documentation build pipeline, generated GitHub
Pages artifact, and validation coverage.

This is a hard rename. Do not retain `deploy:build` as a compatibility alias.

## Update package automation

1. Rename the `deploy:build` key in `package.json` to `docs` without changing its command body.
2. Update `release:check` to invoke `npm run docs` in the same position in the validation chain.
3. Update `.github/workflows/validate-and-pages.yml` so the deployment job runs `npm run docs`.

The renamed script must continue to:

- Build package files before assembling the site.
- Recreate `examples/element-ui/` from maintained sources.
- Run the production documentation build.
- Add `.nojekyll`, `robots.txt`, and the root-only `sitemap.xml` through the existing finalizer.

## Update repository policy tests

Update `test/project-config.test.js` so it:

- Treats `docs` as the composite documentation script.
- Requires the Pages deployment job to run `npm run docs`.
- Continues to reject documentation builds in the npm publish job by checking for `docs` instead
  of `deploy:build`.

Do not weaken the existing separation between validation, Pages deployment, and npm publishing.

## Update maintained documentation

Replace current `deploy:build` references with `docs` in:

- `README.md`
- `AGENTS.md`
- `guides/NPM_PUBLISH_WORKFLOW_PLAN.md`
- `guides/PROJECT_TAKEOVER_AND_PAGES_MIGRATION.md`

Preserve the meaning of each instruction. In particular, the npm publish plan must continue to
prohibit running the documentation build from the publish job.

## Validate the rename

Run the focused policy tests first:

```bash
npm run test:project
```

Build and inspect the GitHub Pages artifact:

```bash
npm run docs
test -f examples/element-ui/index.html
test -f examples/element-ui/.nojekyll
test -f examples/element-ui/robots.txt
test -f examples/element-ui/sitemap.xml
```

Run the complete non-publishing validation chain:

```bash
npm run release:check
```

Confirm that the old command is no longer referenced and that the patch has no whitespace errors:

```bash
rg "deploy:build"
git diff --check
git status --short
```

The `rg` command must return no matches.

## Acceptance criteria

- `npm run docs` produces the same Pages artifact as the former command.
- `npm run release:check` completes with the renamed script.
- The Pages workflow invokes `npm run docs`.
- The npm publish workflow cannot invoke the documentation build.
- Tests and maintained documentation contain no `deploy:build` references.
- No package API, declaration, generated route, or Pages URL changes as part of this rename.
