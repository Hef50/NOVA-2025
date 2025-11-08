export interface User {
  username: string
  passwordHash: string
  email?: string
  createdAt: string
}

const USERS_KEY = 'vacai_users'
const CURRENT_USER_KEY = 'vacai_current_user'

// Simple hash function (for demo purposes - in production use proper hashing)
function simpleHash(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString(36)
}

export const authStorage = {
  // Get all users
  getUsers: (): User[] => {
    try {
      const users = localStorage.getItem(USERS_KEY)
      return users ? JSON.parse(users) : []
    } catch (error) {
      console.error('Error reading users from localStorage:', error)
      return []
    }
  },

  // Initialize with test accounts
  initializeTestAccounts: (): void => {
    const existingUsers = authStorage.getUsers()
    if (existingUsers.length === 0) {
      const testAccounts: User[] = [
        {
          username: 'testuser1',
          passwordHash: simpleHash('TestPass123'),
          email: 'testuser1@vacai.com',
          createdAt: new Date().toISOString()
        },
        {
          username: 'testuser2',
          passwordHash: simpleHash('TestPass456'),
          email: 'testuser2@vacai.com',
          createdAt: new Date().toISOString()
        },
        {
          username: 'admin',
          passwordHash: simpleHash('AdminPass789'),
          email: 'admin@vacai.com',
          createdAt: new Date().toISOString()
        }
      ]
      localStorage.setItem(USERS_KEY, JSON.stringify(testAccounts))
    }
  },

  // Validate password requirements
  validatePassword: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  },

  // Register a new user
  register: (username: string, password: string, email?: string): { success: boolean; error?: string } => {
    const users = authStorage.getUsers()
    
    // Check if username already exists
    if (users.some(u => u.username === username)) {
      return { success: false, error: 'Username already exists' }
    }
    
    // Validate password
    const validation = authStorage.validatePassword(password)
    if (!validation.valid) {
      return { success: false, error: validation.errors[0] }
    }
    
    // Create new user
    const newUser: User = {
      username,
      passwordHash: simpleHash(password),
      email,
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    
    return { success: true }
  },

  // Login
  login: (username: string, password: string): { success: boolean; error?: string } => {
    const users = authStorage.getUsers()
    const user = users.find(u => u.username === username)
    
    if (!user) {
      return { success: false, error: 'Invalid username or password' }
    }
    
    const passwordHash = simpleHash(password)
    if (user.passwordHash !== passwordHash) {
      return { success: false, error: 'Invalid username or password' }
    }
    
    // Store current user
    localStorage.setItem(CURRENT_USER_KEY, username)
    
    return { success: true }
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem(CURRENT_USER_KEY)
  },

  // Get current user
  getCurrentUser: (): string | null => {
    return localStorage.getItem(CURRENT_USER_KEY)
  },

  // Delete account
  deleteAccount: (username: string): void => {
    const users = authStorage.getUsers()
    const filtered = users.filter(u => u.username !== username)
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered))
    
    // If deleting current user, logout
    if (authStorage.getCurrentUser() === username) {
      authStorage.logout()
    }
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return authStorage.getCurrentUser() !== null
  }
}

