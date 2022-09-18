/**
 * Extension registration options.
 * Allowing for extensions to have specific options applied at runtime dynamically
 * Also allows for stand along extensions to be loaded with framework overrides
 */
export interface ExtensionRegistrationOptions {
    notificationServerURL?: string;
    additionalOptions?: any;
}
