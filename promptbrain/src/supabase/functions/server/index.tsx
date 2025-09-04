import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-08c24b4c/health", (c) => {
  return c.json({ status: "ok" });
});

// User signup endpoint
app.post("/make-server-08c24b4c/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, fullName } = body;

    if (!email || !password || !fullName) {
      return c.json({ error: "Email, password, and full name are required" }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        full_name: fullName,
        display_name: fullName 
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error for ${email}: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store additional user profile data in KV store
    const userId = data.user.id;
    await kv.set(`user_profile:${userId}`, {
      id: userId,
      email,
      full_name: fullName,
      created_at: new Date().toISOString(),
      login_count: 0,
      last_login: null,
      account_status: 'active'
    });

    console.log(`User created successfully: ${email}`);
    return c.json({ 
      success: true, 
      user: { 
        id: userId, 
        email, 
        full_name: fullName 
      } 
    });

  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: "Internal server error during signup" }, 500);
  }
});

// User profile endpoint (requires authentication)
app.get("/make-server-08c24b4c/auth/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    // Verify user with access token
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Profile access error: ${error?.message || 'No user found'}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get user profile from KV store
    const profile = await kv.get(`user_profile:${user.id}`);
    
    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    return c.json({ user: profile });

  } catch (error) {
    console.log(`Profile fetch error: ${error}`);
    return c.json({ error: "Internal server error fetching profile" }, 500);
  }
});

// Update login tracking (called after successful login)
app.post("/make-server-08c24b4c/auth/track-login", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    // Verify user with access token
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get current profile
    const profile = await kv.get(`user_profile:${user.id}`);
    
    if (profile) {
      // Update login tracking
      const updatedProfile = {
        ...profile,
        login_count: (profile.login_count || 0) + 1,
        last_login: new Date().toISOString()
      };
      
      await kv.set(`user_profile:${user.id}`, updatedProfile);
      
      console.log(`Login tracked for user: ${user.email}`);
      return c.json({ success: true });
    }

    return c.json({ error: "Profile not found" }, 404);

  } catch (error) {
    console.log(`Login tracking error: ${error}`);
    return c.json({ error: "Internal server error tracking login" }, 500);
  }
});

// Update user role after onboarding step 1
app.post("/make-server-08c24b4c/auth/update-role", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const body = await c.req.json();
    const { role } = body;
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    if (!role || !['creator', 'founder', 'researcher'].includes(role)) {
      return c.json({ error: "Valid role is required (creator, founder, researcher)" }, 400);
    }

    // Verify user with access token
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get current profile
    const profile = await kv.get(`user_profile:${user.id}`);
    
    if (profile) {
      // Update profile with role
      const updatedProfile = {
        ...profile,
        role: role,
        role_selected_at: new Date().toISOString()
      };
      
      await kv.set(`user_profile:${user.id}`, updatedProfile);
      
      console.log(`Role updated for user: ${user.email} -> ${role}`);
      return c.json({ success: true, user: updatedProfile });
    }

    return c.json({ error: "Profile not found" }, 404);

  } catch (error) {
    console.log(`Role update error: ${error}`);
    return c.json({ error: "Internal server error updating role" }, 500);
  }
});

// Complete onboarding flow
app.post("/make-server-08c24b4c/auth/complete-onboarding", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    // Verify user with access token
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get current profile
    const profile = await kv.get(`user_profile:${user.id}`);
    
    if (profile) {
      // Mark onboarding as complete and grant credits
      const updatedProfile = {
        ...profile,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        temple_keys: 10, // Grant 10 free credits
        account_status: 'active'
      };
      
      await kv.set(`user_profile:${user.id}`, updatedProfile);
      
      console.log(`Onboarding completed for user: ${user.email}`);
      return c.json({ success: true, user: updatedProfile });
    }

    return c.json({ error: "Profile not found" }, 404);

  } catch (error) {
    console.log(`Onboarding completion error: ${error}`);
    return c.json({ error: "Internal server error completing onboarding" }, 500);
  }
});

// Get user stats (admin endpoint)
app.get("/make-server-08c24b4c/admin/user-stats", async (c) => {
  try {
    // In a real app, you'd verify admin permissions here
    const allProfiles = await kv.getByPrefix('user_profile:');
    
    const stats = {
      total_users: allProfiles.length,
      active_users: allProfiles.filter(p => p.account_status === 'active').length,
      users_with_logins: allProfiles.filter(p => (p.login_count || 0) > 0).length,
      completed_onboarding: allProfiles.filter(p => p.onboarding_completed).length,
      total_logins: allProfiles.reduce((sum, p) => sum + (p.login_count || 0), 0),
      roles: {
        creator: allProfiles.filter(p => p.role === 'creator').length,
        founder: allProfiles.filter(p => p.role === 'founder').length,
        researcher: allProfiles.filter(p => p.role === 'researcher').length
      }
    };

    return c.json({ stats });

  } catch (error) {
    console.log(`User stats error: ${error}`);
    return c.json({ error: "Internal server error fetching stats" }, 500);
  }
});

// Enhanced prompt endpoint with Flow Zone integration
app.post("/make-server-08c24b4c/enhance-prompt", async (c) => {
  try {
    const body = await c.req.json();
    const { mode, originalPrompt, flowData } = body;

    console.log(`Enhancing prompt in ${mode} mode`);

    // Validate Flow Zone data
    if (mode === 'flow' && (!flowData || !flowData.audience || !flowData.purpose)) {
      return c.json({ error: "Flow mode requires audience and purpose" }, 400);
    }

    // Get Gemini API key
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      console.log("No Gemini API key found, using local enhancement");
      return generateLocalEnhancement(c, mode, originalPrompt, flowData);
    }

    // Prepare Gemini API request
    const geminiPrompt = createGeminiPrompt(mode, originalPrompt, flowData);
    
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: geminiPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (geminiResponse.ok) {
      const geminiData = await geminiResponse.json();
      const enhancedContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (enhancedContent) {
        // Parse enhanced content and create JSON format
        const enhancedPrompt = extractEnhancedPrompt(enhancedContent);
        const jsonFormat = createJsonFormat(flowData, enhancedPrompt);
        
        console.log(`Prompt enhanced successfully using Gemini API`);
        return c.json({
          success: true,
          enhancedPrompt,
          jsonFormat,
          mode
        });
      }
    }

    // Fallback to local enhancement
    console.log("Gemini API failed, falling back to local enhancement");
    return generateLocalEnhancement(c, mode, originalPrompt, flowData);

  } catch (error) {
    console.log(`Enhancement error: ${error}`);
    return generateLocalEnhancement(c, 'local', '', {});
  }
});

// Helper function to create Gemini prompt
function createGeminiPrompt(mode: string, originalPrompt: string, flowData: any): string {
  if (mode === 'flow') {
    return `You are an expert prompt engineer. Create a concise, effective prompt based on these specifications:

Audience: ${flowData.audience}
Purpose: ${flowData.purpose}
Style: ${flowData.style}
Constraints: ${flowData.constraints || 'None'}
${originalPrompt ? `Original request: ${originalPrompt}` : ''}

Create a single, well-crafted prompt that incorporates all these elements. The output should be one clear, actionable prompt that someone could use directly with an AI assistant.

Format your response as just the enhanced prompt, nothing else.`;
  }
  
  return `Enhance this prompt for clarity and effectiveness: "${originalPrompt}"`;
}

// Helper function to extract enhanced prompt from Gemini response
function extractEnhancedPrompt(content: string): string {
  // Clean up the response - remove any markdown formatting or extra text
  return content.trim()
    .replace(/^```[\w]*\n?/, '')  // Remove opening code blocks
    .replace(/\n?```$/, '')       // Remove closing code blocks
    .replace(/^["']|["']$/g, ''); // Remove surrounding quotes
}

// Helper function to create JSON format
function createJsonFormat(flowData: any, enhancedPrompt: string): string {
  const jsonData = {
    audience: flowData?.audience || 'General audience',
    purpose: flowData?.purpose || 'General purpose',
    tone: flowData?.style || 'Professional',
    constraints: flowData?.constraints || 'No specific constraints',
    enhanced_prompt: enhancedPrompt
  };
  
  return JSON.stringify(jsonData, null, 2);
}

// Helper function for local enhancement fallback
function generateLocalEnhancement(c: any, mode: string, originalPrompt: string, flowData: any) {
  let enhancedPrompt: string;
  
  if (mode === 'flow' && flowData) {
    const audience = flowData.audience || 'general audience';
    const purpose = flowData.purpose || 'general purpose';
    const style = flowData.style || 'professional';
    const constraints = flowData.constraints || '';
    
    const constraintsText = constraints ? ` with constraints: ${constraints}` : '';
    enhancedPrompt = `A ${style.toLowerCase()} ${purpose.toLowerCase()} tailored for ${audience.toLowerCase()}${constraintsText}.`;
  } else {
    enhancedPrompt = originalPrompt ? 
      `Enhanced: ${originalPrompt} - Optimized for clarity, specificity, and effectiveness.` :
      'Create a comprehensive and well-structured response tailored to your specific needs.';
  }
  
  const jsonFormat = createJsonFormat(flowData, enhancedPrompt);
  
  return c.json({
    success: true,
    enhancedPrompt,
    jsonFormat,
    mode: mode || 'local'
  });
}

Deno.serve(app.fetch);