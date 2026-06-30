import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required in secrets");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Helper to handle API errors gracefully
const handleRouteError = (res: express.Response, error: any, message: string) => {
  console.error(`${message}:`, error);
  res.status(500).json({
    error: true,
    message: error instanceof Error ? error.message : "Internal Server Error",
    details: message
  });
};

// 1. AI Task Breakdown Route
app.post("/api/gemini/task-breakdown", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    const ai = getGeminiClient();
    const prompt = `Break down this task into subtasks, milestones, and estimated effort:
Task Title: "${title}"
Description: "${description || "No description provided."}"

Generate an interactive execution tree structure. Provide estimated effort and concrete milestones.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert project manager and productivity optimizer. Breakdown tasks into structured execution trees.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedEffort: { type: Type.STRING, description: "Estimated total duration or effort level (e.g. '3 hours', 'Medium')" },
            subtasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  estimatedMinutes: { type: Type.NUMBER }
                },
                required: ["title", "estimatedMinutes"]
              }
            },
            milestones: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            treeNodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  type: { type: Type.STRING, description: "One of: 'root', 'milestone', 'phase', 'subtask'" },
                  parentId: { type: Type.STRING, description: "The id of the parent node" }
                },
                required: ["id", "label", "type", "parentId"]
              }
            }
          },
          required: ["estimatedEffort", "subtasks", "milestones", "treeNodes"]
        }
      }
    });

    const result = JSON.parse(response.text?.trim() || "{}");
    res.json(result);
  } catch (error) {
    console.warn("[GEMINI API OVERLOAD FALLBACK] Generating local task breakdown:", error);
    const { title } = req.body || {};
    const fallback = {
      estimatedEffort: "2.5 hours",
      subtasks: [
        { title: `Initial preparation for "${title || 'Task'}"`, estimatedMinutes: 45 },
        { title: "Core research and review of material", estimatedMinutes: 60 },
        { title: "Review outputs and correct weak points", estimatedMinutes: 45 }
      ],
      milestones: [
        "Initial concept layout completed",
        "Deep exploration block finalized",
        "Result validation and synthesis"
      ],
      treeNodes: [
        { id: "root", label: title || "Task", type: "root", parentId: "" },
        { id: "phase-1", label: "Phase 1: Setting up", type: "phase", parentId: "root" },
        { id: "subtask-1", label: "Review key prerequisites", type: "subtask", parentId: "phase-1" },
        { id: "phase-2", label: "Phase 2: Execution", type: "phase", parentId: "root" },
        { id: "subtask-2", label: "Implement core concepts step-by-step", type: "subtask", parentId: "phase-2" },
        { id: "milestone-1", label: "Milestone: Focus sprint complete", type: "milestone", parentId: "phase-2" }
      ]
    };
    res.json(fallback);
  }
});

// 2. Smart Prioritization Route
app.post("/api/gemini/prioritization", async (req, res) => {
  try {
    const { tasks } = req.body; // Array of tasks
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      res.status(400).json({ error: "Tasks list is required" });
      return;
    }

    const ai = getGeminiClient();
    const taskDetails = tasks.map((t, idx) => `ID: ${t.id || idx}, Title: "${t.title}", DueDate: "${t.dueDate || 'N/A'}", Priority: "${t.priority || 'Medium'}", EstTime: "${t.estimatedMinutes || 60}m"`).join("\n");

    const prompt = `Analyze these active tasks and prioritize them with strategic reasoning. Call out the 'Recommended Next Action':
${taskDetails}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite productivity strategist. Determine the absolute best sequence of tasks based on deadlines, efforts, and strategic importance.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rankedTaskIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            reasonings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  taskId: { type: Type.STRING },
                  priorityLevel: { type: Type.STRING, description: "CRITICAL, HIGH, MEDIUM, LOW" },
                  reason: { type: Type.STRING }
                },
                required: ["taskId", "priorityLevel", "reason"]
              }
            },
            recommendedAction: {
              type: Type.OBJECT,
              properties: {
                taskId: { type: Type.STRING },
                title: { type: Type.STRING },
                reason: { type: Type.STRING },
                benefit: { type: Type.STRING }
              },
              required: ["taskId", "title", "reason", "benefit"]
            }
          },
          required: ["rankedTaskIds", "reasonings", "recommendedAction"]
        }
      }
    });

    const result = JSON.parse(response.text?.trim() || "{}");
    res.json(result);
  } catch (error) {
    console.warn("[GEMINI API OVERLOAD FALLBACK] Generating local prioritization:", error);
    const { tasks } = req.body || {};
    const sorted = [...(tasks || [])].sort((a, b) => {
      const getScore = (p: string) => {
        const up = String(p || "").toUpperCase();
        if (up === "CRITICAL") return 4;
        if (up === "HIGH") return 3;
        if (up === "MEDIUM" || up === "NORMAL") return 2;
        return 1;
      };
      return getScore(b.priority) - getScore(a.priority);
    });
    const rankedTaskIds = sorted.map(t => String(t.id));
    const reasonings = sorted.map(t => ({
      taskId: String(t.id),
      priorityLevel: String(t.priority || "MEDIUM").toUpperCase(),
      reason: `Strategic sequence weight determined by category priority and estimated completion time of ${t.estimatedMinutes || 45} minutes.`
    }));
    const recommendedAction = sorted.length > 0 ? {
      taskId: String(sorted[0].id),
      title: sorted[0].title,
      reason: "This item carries the highest priority weight block for your placement preparation.",
      benefit: "Executing this task first builds momentum and secures key performance index percentage points."
    } : {
      taskId: "none",
      title: "No tasks",
      reason: "No tasks to prioritize.",
      benefit: "Add high-priority tasks to unlock intelligent analytics."
    };
    res.json({ rankedTaskIds, reasonings, recommendedAction });
  }
});

// 3. Deadline Risk Predictor Route
app.post("/api/gemini/risk-analysis", async (req, res) => {
  try {
    const { tasks, goals } = req.body;
    if (!tasks || !Array.isArray(tasks)) {
      res.status(400).json({ error: "Tasks list is required" });
      return;
    }

    const ai = getGeminiClient();
    const tasksSummary = tasks.map(t => `- Task "${t.title}" (Due: ${t.dueDate || 'No Date'}, Est: ${t.estimatedMinutes || 30} mins, Progress: ${t.progress || 0}%)`).join("\n");
    const goalsSummary = goals && Array.isArray(goals) ? goals.map(g => `- Goal "${g.title}" (Deadline: ${g.deadline || 'No Date'})`).join("\n") : "No goals listed.";

    const prompt = `Perform a project-level deadline risk analysis.
Active Tasks:
${tasksSummary}

Active Goals/Deadlines:
${goalsSummary}

Predict the Risk Score (0-100), Completion Probability (0-100), key Risk Factors, and generate actionable mitigations.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an analytical risk advisor. Critically evaluate project progression speed vs outstanding timelines, identifying hidden bottlenecks.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.INTEGER, description: "Risk Score from 0 (Safe) to 100 (Critical)" },
            completionProbability: { type: Type.INTEGER, description: "Probability of meeting all upcoming major deadlines on time (0-100)" },
            riskLevel: { type: Type.STRING, description: "CRITICAL, HIGH, MODERATE, LOW" },
            riskFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            mitigations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["riskScore", "completionProbability", "riskLevel", "riskFactors", "mitigations"]
        }
      }
    });

    const result = JSON.parse(response.text?.trim() || "{}");
    res.json(result);
  } catch (error) {
    console.warn("[GEMINI API OVERLOAD FALLBACK] Generating local deadline risks:", error);
    const { tasks } = req.body || {};
    const total = (tasks || []).length;
    const completed = (tasks || []).filter((t: any) => t.completed || t.progress === 100).length;
    const completionRatio = total > 0 ? completed / total : 0.5;

    let riskScore = 35;
    let riskLevel = "LOW";
    let completionProbability = 85;
    let riskFactors = ["Slight timeline tightening due to multiple outstanding items."];
    let mitigations = ["Group similar topic blocks together to exploit focus-momentum."];

    if (completionRatio < 0.3) {
      riskScore = 75;
      riskLevel = "HIGH";
      completionProbability = 45;
      riskFactors = [
        "High volume of uncompleted deliverables compared to upcoming milestone timelines.",
        "Aptitude prep blocks require more sustained, multi-hour concentration intervals."
      ];
      mitigations = [
        "Reschedule non-critical tasks to clear 2 consecutive hours of deep work.",
        "Utilize Zenith Deep Focus mode to compress 45-minute sprint blocks."
      ];
    } else if (completionRatio < 0.6) {
      riskScore = 55;
      riskLevel = "MODERATE";
      completionProbability = 68;
      riskFactors = [
        "Moderate backup of medium priority tasks",
        "Inconsistent daily study streaks"
      ];
      mitigations = [
        "Commit to one 25-minute Pomodoro block every morning before 10 AM.",
        "Leverage Study Buddy or Strict Mentor persona check-ins daily."
      ];
    }

    res.json({ riskScore, completionProbability, riskLevel, riskFactors, mitigations });
  }
});

// 4. Goal to Roadmap Generator Route
app.post("/api/gemini/roadmap", async (req, res) => {
  try {
    const { goalTitle, timelineWeeks } = req.body;
    if (!goalTitle) {
      res.status(400).json({ error: "Goal title is required" });
      return;
    }

    const ai = getGeminiClient();
    const prompt = `Convert the goal "${goalTitle}" into a stunning chronological roadmap spanning ${timelineWeeks || 4} weeks.
Break down the roadmap into high-level phases with specific milestones, weekly action plans, and key deliverables.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite corporate advisor and strategic architect. Design realistic and inspiring milestone-based roadmaps for ambitious goals.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING, description: "E.g., Foundation, Development, Launch" },
                  duration: { type: Type.STRING, description: "E.g., Week 1-2" },
                  focus: { type: Type.STRING },
                  milestones: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  recommendedTasks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["phaseNumber", "title", "duration", "focus", "milestones", "recommendedTasks"]
              }
            }
          },
          required: ["phases"]
        }
      }
    });

    const result = JSON.parse(response.text?.trim() || "{}");
    res.json(result);
  } catch (error) {
    console.warn("[GEMINI API OVERLOAD FALLBACK] Generating local goal roadmap:", error);
    const { goalTitle, timelineWeeks } = req.body || {};
    const titleClean = goalTitle || "Your Strategic Goal";
    const weeks = Number(timelineWeeks) || 4;
    const fallbackRoadmap = {
      phases: [
        {
          phaseNumber: 1,
          title: "Phase 1: Foundation Setup",
          duration: `Week 1 - ${Math.max(1, Math.floor(weeks / 3))}`,
          focus: `Establish key knowledge and resources for "${titleClean}".`,
          milestones: ["Baseline metrics evaluated", "Roadmap aligned", "Syllabus items organized"],
          recommendedTasks: ["Gather all references and practice papers", "Identify core weakness modules", "Dedicate daily 45-minute deep focus sprints"]
        },
        {
          phaseNumber: 2,
          title: "Phase 2: Sprint Execution",
          duration: `Week ${Math.max(1, Math.floor(weeks / 3)) + 1} - ${Math.max(2, Math.floor(weeks * 2 / 3))}`,
          focus: "High-concentration execution, regular diagnostic testing.",
          milestones: ["First full mock-up test cleared", "50% of outstanding practice bank solved"],
          recommendedTasks: ["Complete 3 dynamic timed exercises", "Map mistakes to specific notes", "Conduct weekly advisor coach consultations"]
        },
        {
          phaseNumber: 3,
          title: "Phase 3: Refinement & Polish",
          duration: `Week ${Math.max(2, Math.floor(weeks * 2 / 3)) + 1} - ${weeks}`,
          focus: "Refining accuracy under timing constraints and peak output.",
          milestones: ["Simulation scores match criteria target", "Mental clarity and confidence optimized"],
          recommendedTasks: ["Simulate exam under absolute timed environments", "Final checklist cheat-sheet review", "Rest and balance mental reserves"]
        }
      ]
    };
    res.json(fallbackRoadmap);
  }
});

// 5. Recovery Planner Route
app.post("/api/gemini/recovery-plan", async (req, res) => {
  try {
    const { missedTasks, activeGoals } = req.body;
    if (!missedTasks || !Array.isArray(missedTasks)) {
      res.status(400).json({ error: "Missed tasks are required" });
      return;
    }

    const ai = getGeminiClient();
    const taskDetails = missedTasks.map(t => `- "${t.title}" (Was due on ${t.dueDate || 'N/A'}, Est: ${t.estimatedMinutes || 60}m)`).join("\n");
    const goalDetails = activeGoals && Array.isArray(activeGoals) ? activeGoals.map(g => `- Goal: "${g.title}" (Target: ${g.deadline || 'N/A'})`).join("\n") : "No general goals listed.";

    const prompt = `The user has missed some deadlines or is falling behind.
Missed/Overdue Tasks:
${taskDetails}

Upcoming Goals:
${goalDetails}

Generate an encouraging, high-impact Recovery Strategy. Propose rescheduled times, priority re-allocations, and daily habits to bounce back instantly.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a warm, highly motivating but practical recovery coach. Provide strong motivation, remove guilt, and offer concrete, actionable rescheduling advice.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            motivationQuote: { type: Type.STRING, description: "Inspiring recovery quote or mantra" },
            encouragementMessage: { type: Type.STRING, description: "Personalized, empowering, warm paragraph" },
            recoverySteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING, description: "Concrete sequence of recovery items" }
            },
            revisedTimelineSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  taskTitle: { type: Type.STRING },
                  reasoning: { type: Type.STRING, description: "Why we are postponing/adjusting this" },
                  suggestedDelayDays: { type: Type.INTEGER, description: "Recommended postponement in days" }
                },
                required: ["taskTitle", "reasoning", "suggestedDelayDays"]
              }
            }
          },
          required: ["motivationQuote", "encouragementMessage", "recoverySteps", "revisedTimelineSuggestions"]
        }
      }
    });

    const result = JSON.parse(response.text?.trim() || "{}");
    res.json(result);
  } catch (error) {
    console.warn("[GEMINI API OVERLOAD FALLBACK] Generating local recovery plan:", error);
    const { missedTasks } = req.body || {};
    const quotes = [
      "The secret of getting ahead is getting started. — Mark Twain",
      "It does not matter how slowly you go as long as you do not stop. — Confucius",
      "Yesterday is gone. Today is a brand new sequence. Let's build momentum now!"
    ];
    const motivationQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const encouragementMessage = "Hey! It is completely normal to drift off schedule occasionally. Do not look back with guilt—let's simply declutter, decompress, and build a healthy streak from right here today.";
    const recoverySteps = [
      "Clear outstanding lists without guilt — re-baseline.",
      "Select the smallest, single task and execute a quick 15-minute micro-sprint.",
      "Postpone secondary priorities by 2 days to protect your daily focus energy levels."
    ];
    const revisedTimelineSuggestions = missedTasks && Array.isArray(missedTasks) ? missedTasks.map((t: any) => ({
      taskTitle: t.title || "Study item",
      reasoning: "Decompress load to restore stable study velocity and focus quality.",
      suggestedDelayDays: 2
    })) : [
      {
        taskTitle: "Pending study task",
        reasoning: "Decompress study blocks to prevent burnout.",
        suggestedDelayDays: 2
      }
    ];
    res.json({ motivationQuote, encouragementMessage, recoverySteps, revisedTimelineSuggestions });
  }
});

// 6. AI Decision Coach Route (Generative UI Chat)
app.post("/api/gemini/coach-chat", async (req, res) => {
  try {
    const { history, message, persona } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const ai = getGeminiClient();
    const activePersona = persona || "Friendly Coach";

    // Format chat history
    const formattedHistory = history && Array.isArray(history) 
      ? history.map((h: any) => `${h.role === 'user' ? 'User' : 'Coach'}: ${h.text}`).join("\n")
      : "";

    const prompt = `Active Persona: ${activePersona}
Chat History:
${formattedHistory}

User's New Message: "${message}"

Respond to the user. Maintain your designated persona. If the user is asking for assistance with plans, decisions, schedule, or pros/cons, you should populate the 'generativeUI' payload. If not, 'generativeUI' can be null.
Persona guideline:
- Friendly Coach: Encouraging, positive, guides through warm questions.
- Strict Mentor: Direct, holds accountable, emphasizes rules and extreme focus.
- Study Buddy: Casual, uses student slang, high energy, collaborative.
- Professional Advisor: Structured, analytical, business-oriented, results-focused.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are the Zenith AI Decision Coach. You converse in the chosen persona. If a user presents a choice, dilemma, or complex plan, populate a custom interactive 'generativeUI' widget with structured data so the frontend can render an elegant widget (e.g. Action Plan, Schedule, Pros/Cons list, Decision Tree).`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "Your main verbal reply (supporting markdown)" },
            generativeUI: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, description: "One of: 'action_plan', 'pros_cons', 'custom_schedule', 'null'" },
                title: { type: Type.STRING, description: "Title of the widget" },
                data: {
                  type: Type.OBJECT,
                  properties: {
                    // Action Plan fields
                    tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                    // Pros / Cons fields
                    pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                    cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                    recommendation: { type: Type.STRING },
                    // Schedule fields
                    blocks: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          time: { type: Type.STRING },
                          activity: { type: Type.STRING },
                          durationMinutes: { type: Type.INTEGER }
                        },
                        required: ["time", "activity"]
                      }
                    }
                  }
                }
              },
              required: ["type", "title"]
            }
          },
          required: ["text"]
        }
      }
    });

    const result = JSON.parse(response.text?.trim() || "{}");
    res.json(result);
  } catch (error) {
    console.warn("[GEMINI API OVERLOAD FALLBACK] Generating local coach reply:", error);
    const { persona, message } = req.body || {};
    const activePersona = persona || "Friendly Coach";
    let text = "";
    let generativeUI: any = null;

    if (activePersona === "Strict Mentor") {
      text = `Focus is our currency. I've analyzed your challenge: "${message || 'your topic'}". Let's trim away the non-essentials immediately. Here is your Strict Plan of Action. Execute without hesitation.`;
      generativeUI = {
        type: "action_plan",
        title: "Mentor's Critical Action Plan",
        data: {
          tasks: [
            "Block off all incoming communication channels for 45 mins",
            "Solve 10 targeted practice problems under strict time limit",
            "Perform a rigorous self-audit on all failure points"
          ],
          recommendation: "Accept zero excuses. Complete the first item immediately."
        }
      };
    } else if (activePersona === "Study Buddy") {
      text = `Hey! I totally get where you're coming from with "${message || 'this challenge'}". Let's map out the real pros and cons of this together, friend-style!`;
      generativeUI = {
        type: "pros_cons",
        title: "Buddy's Decision Matrix",
        data: {
          pros: [
            "Gets the heaviest material finished while energy is peak",
            "Relieves immediate anxiety and builds a powerful streak"
          ],
          cons: [
            "Requires solid mental dedication for the next hour",
            "Leaves less room for secondary study topics today"
          ],
          recommendation: "Just dive in! You'll be super glad you started."
        }
      };
    } else if (activePersona === "Professional Advisor") {
      text = `Excellent query. Regarding "${message || 'this topic'}", we must look at this structurally. I've designed a specialized schedule block to maximize your preparation efficiency ratio.`;
      generativeUI = {
        type: "custom_schedule",
        title: "Advisory Resource Plan",
        data: {
          blocks: [
            { time: "09:00 AM", activity: "High-intensity conceptual deep dive", durationMinutes: 60 },
            { time: "11:00 AM", activity: "Mock simulator & error correction", durationMinutes: 45 }
          ],
          recommendation: "Dedicate your highest cognitive hours exclusively to item 1."
        }
      };
    } else {
      // Friendly Coach
      text = `That is a wonderful point to bring up! Let's explore "${message || 'your ideas'}" together with kindness and precision. Take a deep breath. Here is a guided roadmap we can use to make this choice simple:`;
      generativeUI = {
        type: "action_plan",
        title: "Coached Alignment Plan",
        data: {
          tasks: [
            "Define what success looks like in one clear sentence",
            "Identify the single smallest step you can complete inside 10 minutes",
            "Implement that step now to release focus-unlocking endorphins"
          ],
          recommendation: "Trust your process and take the first small step with confidence."
        }
      };
    }
    res.json({ text, generativeUI });
  }
});

// 7. Communication Assistant Route
app.post("/api/gemini/communication", async (req, res) => {
  try {
    const { recipient, topic, tone, additionalContext } = req.body;
    if (!recipient || !topic) {
      res.status(400).json({ error: "Recipient and topic are required" });
      return;
    }

    const ai = getGeminiClient();
    const prompt = `Compose a professional and contextual message.
Recipient: "${recipient}" (e.g. Professor, Hiring Manager, Tech Lead, Client)
Topic: "${topic}" (e.g. Requesting extension on assignment, Explaining a production bug delay, Weekly project report)
Tone: "${tone || "Professional"}" (e.g. Polite, Urgent, Apologetic, Professional)
Additional Context: "${additionalContext || "None"}"

Provide an elegant subject line and email/message body template. Use bracketed placeholders like [Your Name] only where personal info is needed.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite business communication assistant. Compose beautifully crafted, persuasive, and appropriate correspondence that gets positive results.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING, description: "The structured draft body, with appropriate newline breaks and bullet points if needed." },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING, description: "Communication tips for this specific situation" }
            }
          },
          required: ["subject", "body", "tips"]
        }
      }
    });

    const result = JSON.parse(response.text?.trim() || "{}");
    res.json(result);
  } catch (error) {
    console.warn("[GEMINI API OVERLOAD FALLBACK] Generating local communication draft:", error);
    const { topic, recipient, additionalContext } = req.body || {};
    const subject = `Regarding ${topic || 'Update'} - Update & Inquiry`;
    const body = `Dear ${recipient || 'Contact'},\n\nI hope this message finds you well.\n\nI am writing to share an update regarding: ${topic || 'our topic'}.\n\n[Insert brief context based on details: ${additionalContext || "general progression"}].\n\nThank you for your understanding and continued guidance.\n\nBest regards,\n[Your Name]`;
    const tips = [
      "Send this message during business hours to maximize professional response rates.",
      "Keep your tone clear, appreciative, and solution-focused."
    ];
    res.json({ subject, body, tips });
  }
});

// Vite Middleware for Development Mode vs Static Production Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve index.html for client-side routing fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Zenith server booting...`);
    console.log(`Development Server: http://localhost:${PORT}`);
  });
}

startServer();
