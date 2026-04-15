# Custom Listing Notifications - enableCustomListingNotifications

## Name

`enableCustomListingNotifications`

## Description

When true, users have access to custom notification settings. This enables users to configure personalized notification preferences for listing alerts and updates.

## Additional Information

This feature flag controls access to the custom notification settings interface. When enabled, users can:

- Manage notification by listing features preferences
- Customize other notification-related settings

The actual notification settings page and notification delivery logic should check for this flag before granting access to users.

## Scope

- **Jurisdiction-specific**: Enabled/disabled per jurisdiction
- **User-facing**: Affects both public and partner site users
