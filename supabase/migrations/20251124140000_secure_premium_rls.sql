-- Migration: Secure Premium RLS
-- Date: 2025-11-24
-- Description: Enforce premium access checks at the database level using user_entitlements.

set check_function_bodies = off;

-- 1. Drop existing permissive policies
drop policy if exists "authenticated can read all cards" on public.cards;
drop policy if exists "authenticated can read all sections" on public.card_sections;

-- 2. Create restrictive policy for cards
-- Users can read a card if:
-- a) It is NOT premium
-- b) OR they have a valid premium entitlement
create policy "authenticated can read cards based on entitlements" on public.cards
for select
to authenticated
using (
  is_premium = false OR
  exists (
    select 1 from public.user_entitlements
    where user_id = auth.uid()
    and can_view_premium = true
  )
);

-- 3. Create restrictive policy for card_sections
-- Users can read sections if the parent card is accessible (free or premium+entitled)
create policy "authenticated can read sections based on entitlements" on public.card_sections
for select
to authenticated
using (
  exists (
    select 1 from public.cards c
    where c.id = card_sections.card_id
    and (
      c.is_premium = false OR
      exists (
        select 1 from public.user_entitlements
        where user_id = auth.uid()
        and can_view_premium = true
      )
    )
  )
);
