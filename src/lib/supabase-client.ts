import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

const supabaseUrl = "https://ibfeluxkyeerjzkxiaki.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZmVsdXhreWVlcmp6a3hpYWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNjEwNjIsImV4cCI6MjA1NDgzNzA2Mn0.wu5KePMH7lZCzy3TY6Ok5-e0C3LHjV3ZqdyUv2RdvVI";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// User related functions
export async function signUp(
  email: string,
  password: string,
  username: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
}

// Pen related functions
export async function savePen(pen: {
  title: string;
  description?: string;
  html: string;
  css: string;
  js: string;
  user_id: string;
  id?: string;
}) {
  if (pen.id) {
    // Update existing pen
    const { data, error } = await supabase
      .from("pens")
      .update({
        title: pen.title,
        description: pen.description || "",
        html: pen.html,
        css: pen.css,
        js: pen.js,
        updated_at: new Date().toISOString(),
      })
      .eq("id", pen.id)
      .select();
    return { data, error };
  } else {
    // Create new pen
    const { data, error } = await supabase
      .from("pens")
      .insert([
        {
          title: pen.title,
          description: pen.description || "",
          html: pen.html,
          css: pen.css,
          js: pen.js,
          user_id: pen.user_id,
        },
      ])
      .select();
    return { data, error };
  }
}

export async function getUserPens(userId: string) {
  const { data, error } = await supabase
    .from("pens")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  return { data, error };
}

export async function getPenById(penId: string) {
  const { data, error } = await supabase
    .from("pens")
    .select("*")
    .eq("id", penId)
    .single();
  return { data, error };
}

export async function forkPen(originalPenId: string, userId: string) {
  // First get the original pen
  const { data: originalPen, error: fetchError } =
    await getPenById(originalPenId);

  if (fetchError || !originalPen) {
    return { data: null, error: fetchError || new Error("Pen not found") };
  }

  // Create a new pen based on the original
  const { data, error } = await supabase
    .from("pens")
    .insert([
      {
        title: `Fork of ${originalPen.title}`,
        description: originalPen.description,
        html: originalPen.html,
        css: originalPen.css,
        js: originalPen.js,
        user_id: userId,
        forked_from: originalPenId,
      },
    ])
    .select();

  return { data, error };
}

export async function deletePen(penId: string) {
  const { error } = await supabase.from("pens").delete().eq("id", penId);
  return { error };
}

// Get popular pens for explore page
export async function getPopularPens(limit = 12) {
  const { data, error } = await supabase
    .from("pens")
    .select("*, profiles(username)")
    .order("likes", { ascending: false })
    .limit(limit);
  return { data, error };
}

// Like a pen
export async function likePen(penId: string, userId: string) {
  // First check if the user already liked this pen
  const { data: existingLike } = await supabase
    .from("likes")
    .select("*")
    .eq("pen_id", penId)
    .eq("user_id", userId)
    .single();

  if (existingLike) {
    // User already liked this pen, so unlike it
    const { error: unlikeError } = await supabase
      .from("likes")
      .delete()
      .eq("pen_id", penId)
      .eq("user_id", userId);

    if (unlikeError) return { error: unlikeError };

    // Decrement the likes count
    const { error: updateError } = await supabase.rpc("decrement_likes", {
      pen_id: penId,
    });
    return { error: updateError };
  } else {
    // User hasn't liked this pen yet, so like it
    const { error: likeError } = await supabase
      .from("likes")
      .insert([{ pen_id: penId, user_id: userId }]);

    if (likeError) return { error: likeError };

    // Increment the likes count
    const { error: updateError } = await supabase.rpc("increment_likes", {
      pen_id: penId,
    });
    return { error: updateError };
  }
}
