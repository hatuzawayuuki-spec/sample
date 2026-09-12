## Git worktree と PR

実装依頼（コード、設定、ドキュメント、テストの変更を含む）は、次の手順を必須とする。

1. 最新の `main` を起点に、`codex/<内容を表す短い名前>` ブランチの専用Git worktreeで作業する。
2. `main` の作業ツリーを直接変更・commit・pushしない。
3. 実装とあわせて必要なテストと `docs/` を更新し、検証を実行する。
4. 作業ブランチへcommit・pushし、`main` 向けのPull Requestを作成する。
5. ユーザーの明示的な指示がない限り、Pull Requestを自己マージしない。

ユーザーが直接 `main` への反映を明示的に指示した場合のみ例外とする。詳細は [docs/development-workflow.md](docs/development-workflow.md) を参照する。

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
