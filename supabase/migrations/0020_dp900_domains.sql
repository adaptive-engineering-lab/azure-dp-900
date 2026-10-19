-- Swap questions.domain to the four DP-900 exam domains. 0001 was applied
-- with the AZ-900 slugs before the fork was retargeted, so the constraint is
-- replaced here rather than edited in place. The bank is empty at this point,
-- so no rows need remapping.

alter table public.questions drop constraint if exists questions_domain_chk;

alter table public.questions add constraint questions_domain_chk
  check (domain in (
    'core-data-concepts',
    'relational-data',
    'non-relational-data',
    'analytics-workloads'
  ));
