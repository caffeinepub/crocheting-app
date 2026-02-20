# Specification

## Summary
**Goal:** Fix the Navigation component to properly detect authentication state changes and immediately display the Admin link for admin users after login.

**Planned changes:**
- Add useEffect hooks in Navigation component to watch for identity state changes from useInternetIdentity
- Configure useIsCallerAdmin query with enabled option based on authenticated identity presence
- Implement refetch mechanism to trigger admin status check when identity transitions from unauthenticated to authenticated
- Ensure Admin link appears within 1-2 seconds after successful Internet Identity login

**User-visible outcome:** After logging in with Internet Identity, admin users will immediately see the Admin link appear in the navigation bar without needing to refresh the page or navigate away and back.
