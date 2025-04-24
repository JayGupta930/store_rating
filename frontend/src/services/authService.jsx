// src/services/authService.js
import { supabase } from "./supabaseClient";

// SIGN UP FUNCTION
export async function registerUser({ email, password, name, address, role }) {
  try {
    // First create the auth user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          data: {
            name,
            role,
            address,
          },
        },
      }
    );

    if (signUpError) return { error: signUpError.message };

    // Insert the additional user data into the profiles table
    const { error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: signUpData.user.id,
        name: name,
        role: role,
        address: address,
        email: email,
      })
      .select();

    if (insertError) {
      console.error("Error inserting user data:", insertError);
      return { error: insertError.message };
    }

    // Store role temporarily for login
    localStorage.setItem('registeredRole', role);
    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Registration failed. Please try again." };
  }
}

// LOGIN FUNCTION
export async function loginUser({ email, password }) {
  try {
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) return { error: loginError.message };

    // Fetch the user's role and other data from profiles table
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", loginData.user.id)
      .single();

    if (userError) return { error: userError.message };

    return {
      user: loginData.user,
      userData: userData,
    };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Login failed. Please try again." };
  }
}
