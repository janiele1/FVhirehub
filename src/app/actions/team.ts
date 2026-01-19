'use server'

import { supabaseAdmin } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"
import { randomBytes } from "crypto"

export async function createAdminUser(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
        return { error: "Email and password are required" }
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    })

    if (error) {
        console.error("Error creating user:", error)
        return { error: error.message }
    }

    revalidatePath("/admin/team")
    return { success: true }
}

export async function deleteAdminUser(userId: string) {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (error) {
        console.error("Error deleting user:", error)
        throw new Error("Failed to delete user")
    }

    revalidatePath("/admin/team")
}

export async function listAdminUsers() {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
        console.error("Error listing users:", error)
        return []
    }

    return users
}
