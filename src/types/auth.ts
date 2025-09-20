/**
 * User entity representing an authenticated user in the system.
 * Contains user identification, role information, and hospital access permissions.
 * 
 * @interface User
 * @category Authentication
 * @since 1.0.0
 * 
 * @remarks
 * The User interface is central to the application's authentication and authorization system.
 * It supports role-based access control (RBAC) and multi-hospital management through the
 * role and hospitalIds properties.
 * 
 * @example
 * System Administrator with full access:
 * ```typescript
 * const adminUser: User = {
 *   id: 'user-001',
 *   email: 'admin@hospitalfinance.com',
 *   name: 'System Administrator',
 *   role: 'admin',
 *   createdAt: '2024-01-15T08:30:00Z',
 *   lastLogin: '2024-03-15T14:22:00Z'
 * };
 * ```
 * 
 * @example
 * Hospital Owner with access to multiple facilities:
 * ```typescript
 * const hospitalOwner: User = {
 *   id: 'user-002',
 *   email: 'owner@metrogeneral.com',
 *   name: 'Dr. Sarah Johnson',
 *   role: 'hospital_owner',
 *   hospitalIds: ['general-001', 'specialty-002'],
 *   createdAt: '2024-01-20T10:15:00Z'
 * };
 * ```
 * 
 * @example
 * Branch Manager with single hospital access:
 * ```typescript
 * const branchManager: User = {
 *   id: 'user-003',
 *   email: 'manager@pediatric.com',
 *   name: 'John Smith',
 *   role: 'branch_manager',
 *   hospitalIds: ['pediatric-001'],
 *   createdAt: '2024-02-01T09:00:00Z'
 * };
 * ```
 */
export interface User {
  /** 
   * Unique identifier for the user.
   * Format: 'user-{sequential-number}'
   * @example 'user-001', 'user-002'
   */
  id: string;
  
  /** 
   * User's email address (used for authentication).
   * Must be a valid email format and unique in the system.
   * @example 'admin@hospitalfinance.com'
   */
  email: string;
  
  /** 
   * Full display name of the user.
   * Should be properly capitalized and include title if applicable.
   * @example 'Dr. Sarah Johnson', 'John Smith'
   */
  name: string;
  
  /** 
   * User's role determining access permissions.
   * - admin: Full system access
   * - hospital_owner: Access to multiple assigned hospitals
   * - branch_manager: Access to single assigned hospital
   * @see UserRole
   */
  role: UserRole;
  
  /** 
   * Single hospital ID for branch owners.
   * @deprecated Use hospitalIds array instead
   * @example 'general-001'
   */
  hospitalId?: string;
  
  /** 
   * Array of hospital IDs the user can access.
   * - Required for hospital_owner and branch_manager roles
   * - Optional for admin (has implicit access to all hospitals)
   * @example ['general-001', 'specialty-002']
   */
  hospitalIds?: string[];
  
  /** 
   * ISO timestamp of when the user account was created.
   * System-generated, immutable field.
   * @example '2024-01-15T08:30:00Z'
   */
  createdAt: string;
  
  /** 
   * ISO timestamp of the user's last successful login.
   * Updated automatically by the authentication system.
   * @example '2024-03-15T14:22:00Z'
   */
  lastLogin?: string;
  
  /** Hashed password for authentication (internal use only) */
  passwordHash?: string;
}

/**
 * Union type defining the available user roles in the system.
 * Each role has different access permissions and hospital visibility.
 * 
 * @type UserRole
 * 
 * **Role Descriptions:**
 * - `admin`: Full system access, can view all hospitals and data
 * - `hospital_owner`: Can view multiple hospitals they own/manage
 * - `branch_owner`: Can view specific hospital branches they manage
 * 
 * @example
 * ```typescript
 * const userRole: UserRole = 'hospital_owner';
 * ```
 */
export type UserRole = 'admin' | 'hospital_owner' | 'branch_owner';

/**
 * Authentication context type providing user state and authentication methods.
 * This interface defines the shape of the authentication context used throughout the app.
 * 
 * @interface AuthContextType
 * @example
 * ```typescript
 * const { user, isAuthenticated, signIn, signOut } = useAuth();
 * 
 * if (isAuthenticated && user) {
 *   console.log(`Welcome, ${user.name}!`);
 * }
 * ```
 */
export interface AuthContextType {
  /** Currently authenticated user, null if not authenticated */
  user: User | null;
  
  /** Boolean indicating if a user is currently authenticated */
  isAuthenticated: boolean;
  
  /** Boolean indicating if authentication is in progress */
  isLoading: boolean;
  
  /** 
   * Authenticates a user with email and password.
   * @param email - User's email address
   * @param password - User's password
   * @throws {Error} If credentials are invalid or account is locked
   */
  signIn: (email: string, password: string) => Promise<void>;
  
  /** 
   * Registers a new user account.
   * @param userData - User registration information
   * @throws {Error} If registration fails or email already exists
   */
  signUp: (userData: SignUpData) => Promise<void>;
  
  /** Signs out the current user and clears authentication state */
  signOut: () => void;
  
  /** 
   * Checks if the current user can access a specific hospital.
   * @param hospitalId - ID of the hospital to check access for
   * @returns true if user has access, false otherwise
   */
  canAccessHospital: (hospitalId: string) => boolean;
  
  /** 
   * Gets array of hospital IDs the current user can access.
   * @returns Array of hospital IDs, empty array if no access
   */
  getAccessibleHospitals: () => string[];
}

/**
 * Data structure for user registration containing all required signup information.
 * 
 * @interface SignUpData
 * @example
 * ```typescript
 * const newUser: SignUpData = {
 *   name: 'Dr. John Smith',
 *   email: 'john.smith@example.com',
 *   password: 'SecurePass123!',
 *   role: 'hospital_owner',
 *   hospitalIds: ['general-001']
 * };
 * ```
 */
export interface SignUpData {
  /** Full name of the user */
  name: string;
  
  /** Email address (must be unique) */
  email: string;
  
  /** Password (must meet security requirements) */
  password: string;
  
  /** Role to assign to the new user */
  role: UserRole;
  
  /** Single hospital ID (deprecated in favor of hospitalIds) */
  hospitalId?: string;
  
  /** Array of hospital IDs the user should have access to */
  hospitalIds?: string[];
}

/**
 * Login credentials for user authentication.
 * 
 * @interface SignInCredentials
 * @example
 * ```typescript
 * const credentials: SignInCredentials = {
 *   email: 'user@example.com',
 *   password: 'userPassword123'
 * };
 * ```
 */
export interface SignInCredentials {
  /** User's email address */
  email: string;
  
  /** User's password */
  password: string;
}

/**
 * Authentication error structure for consistent error handling.
 * 
 * @interface AuthError
 * @example
 * ```typescript
 * const authError: AuthError = {
 *   message: 'Invalid email or password',
 *   code: 'INVALID_CREDENTIALS'
 * };
 * ```
 */
export interface AuthError {
  /** Human-readable error message */
  message: string;
  
  /** Machine-readable error code for programmatic handling */
  code: string;
}

