# content/private

Retrospectives and peer evaluations are submitted through Blackboard and are
never published on the portal. If you want to draft them next to the code,
put them in `content/private/`; that folder is gitignored, and
`scripts/validate.mjs` fails any build whose output contains the sentinel
`PRIVATE-DO-NOT-PUBLISH`, so put that string in the first line of every
private draft.
