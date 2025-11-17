create or replace view public.user_entitlements as
with entitlements as (
    select
        p.id as user_id,
        p.subscription_tier,
        p.subscription_status,
        p.expires_at,
        (coalesce(p.subscription_status, 'inactive') in ('active', 'trialing')
            and coalesce(p.subscription_tier, 'free') not in ('free', 'trial')
            and (p.expires_at is null or p.expires_at > timezone('utc', now()))
        ) as can_view_premium
    from public.profiles p
)
select *
from entitlements
where user_id = auth.uid();
