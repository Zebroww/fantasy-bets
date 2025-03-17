interface User {
    id: string
    name: string
    email: string
    balance: number
  }
  
  interface SignInData {
    email: string
    password: string
  }
  
  interface SignUpData {
    name: string
    email: string
    password: string
  }
  
  const STORAGE_KEY = "nfl_betting_user"
  const CURRENT_USER_KEY = "nfl_betting_current_user"
  
  export function getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
  
    const userJson = localStorage.getItem(CURRENT_USER_KEY)
    return userJson ? JSON.parse(userJson) : null
  }
  
  export async function signIn(data: SignInData): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  
    const userJson = localStorage.getItem(STORAGE_KEY)
    const storedUsers = userJson ? JSON.parse(userJson) : []
  
    const user = Array.isArray(storedUsers) ? storedUsers.find((u: User) => u.email === data.email) : null
  
    if (!user) {
      throw new Error("Invalid email or password")
    }
  
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  
    return user
  }
  
  export async function signUp(data: SignUpData): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  
    const userJson = localStorage.getItem(STORAGE_KEY)
    const users = userJson ? JSON.parse(userJson) : []
  
    if (Array.isArray(users) && users.some((u: User) => u.email === data.email)) {
      throw new Error("Email already in use")
    }
  
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      balance: 100, 
    }
  
    const updatedUsers = Array.isArray(users) ? [...users, newUser] : [newUser]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers))
  
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))
  
    return newUser
  }
  
  export function signOut(): void {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
  
  export async function addBalance(amount: number): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  
    const userJson = localStorage.getItem(CURRENT_USER_KEY)
    if (!userJson) {
      throw new Error("You must be logged in to add balance")
    }
  
    const currentUser: User = JSON.parse(userJson)
  
    const updatedUser: User = {
      ...currentUser,
      balance: currentUser.balance + amount,
    }
  
    
    const allUsersJson = localStorage.getItem(STORAGE_KEY)
    const allUsers = allUsersJson ? JSON.parse(allUsersJson) : []
  
    const updatedUsers = Array.isArray(allUsers)
      ? allUsers.map((u: User) => (u.id === updatedUser.id ? updatedUser : u))
      : [updatedUser]
  
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers))
  
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser))
  
    return updatedUser
  }
  
  