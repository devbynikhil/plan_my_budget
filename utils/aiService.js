// Multi-provider AI service supporting OpenAI, Groq, Ollama, and Hugging Face

/**
 * AI Service Configuration
 * Supports multiple providers with fallback options
 */

// Provider configurations
const AI_PROVIDERS = {
  OPENAI: 'openai',
  GROQ: 'groq',
  XAI: 'xai', // xAI (Grok) - Elon Musk's AI
  OLLAMA: 'ollama',
  HUGGINGFACE: 'huggingface',
  MOCK: 'mock' // For development/testing
};

// Get the configured provider from environment
const getAIProvider = () => {
  return process.env.AI_PROVIDER || AI_PROVIDERS.MOCK; // Default to mock for safety
};

// Initialize the appropriate AI client based on provider
const initializeAIClient = async () => {
  const provider = getAIProvider();
  
  switch (provider) {
    case AI_PROVIDERS.OPENAI:
      return await initializeOpenAI();
    case AI_PROVIDERS.GROQ:
      return await initializeGroq();
    case AI_PROVIDERS.XAI:
      return await initializeXAI();
    case AI_PROVIDERS.OLLAMA:
      return initializeOllama();
    case AI_PROVIDERS.HUGGINGFACE:
      return initializeHuggingFace();
    case AI_PROVIDERS.MOCK:
      return initializeMock();
    default:
      console.warn(`Unknown AI provider: ${provider}, falling back to mock`);
      return initializeMock();
  }
};

// OpenAI client (paid)
const initializeOpenAI = async () => {
  try {
    // Skip OpenAI in test environment to avoid browser-like environment error
    if (process.env.NODE_ENV === 'test') {
      return null;
    }
    
    const { default: OpenAI } = await import('openai');
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: process.env.NODE_ENV === 'test', // Only for tests
    });
  } catch (error) {
    console.error('Failed to initialize OpenAI:', error);
    return null;
  }
};

// Groq client (free with rate limits)
const initializeGroq = async () => {
  try {
    const { default: Groq } = await import('groq-sdk');
    return new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  } catch (error) {
    console.error('Failed to initialize Groq:', error);
    return null;
  }
};

// xAI (Grok) client - uses OpenAI-compatible API
const initializeXAI = async () => {
  try {
    const { default: OpenAI } = await import('openai');
    return new OpenAI({
      apiKey: process.env.XAI_API_KEY,
      baseURL: 'https://api.x.ai/v1',
    });
  } catch (error) {
    console.error('Failed to initialize xAI:', error);
    return null;
  }
};

// Ollama client (local/free)
const initializeOllama = () => {
  return {
    baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama2'
  };
};

// Hugging Face client (free with rate limits)
const initializeHuggingFace = () => {
  return {
    apiKey: process.env.HUGGINGFACE_API_KEY,
    model: process.env.HUGGINGFACE_MODEL || 'microsoft/DialoGPT-medium'
  };
};

// Mock client for development
const initializeMock = () => {
  return { type: 'mock' };
};

// Generic chat completion function
const createChatCompletion = async (messages, options = {}) => {
  const provider = getAIProvider();
  const client = await initializeAIClient();
  
  if (!client) {
    throw new Error(`Failed to initialize AI client for provider: ${provider}`);
  }
  
  switch (provider) {
    case AI_PROVIDERS.OPENAI:
      return await createOpenAICompletion(client, messages, options);
    case AI_PROVIDERS.GROQ:
      return await createGroqCompletion(client, messages, options);
    case AI_PROVIDERS.XAI:
      return await createXAICompletion(client, messages, options);
    case AI_PROVIDERS.OLLAMA:
      return await createOllamaCompletion(client, messages, options);
    case AI_PROVIDERS.HUGGINGFACE:
      return await createHuggingFaceCompletion(client, messages, options);
    case AI_PROVIDERS.MOCK:
      return await createMockCompletion(messages, options);
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
};

// OpenAI completion
const createOpenAICompletion = async (client, messages, options) => {
  const completion = await client.chat.completions.create({
    model: options.model || "gpt-3.5-turbo",
    messages,
    max_tokens: options.maxTokens || 800,
    temperature: options.temperature || 0.7,
  });
  
  return {
    content: completion.choices[0].message.content,
    usage: completion.usage,
    provider: AI_PROVIDERS.OPENAI
  };
};

// Groq completion (free alternative)
const createGroqCompletion = async (client, messages, options) => {
  const completion = await client.chat.completions.create({
    model: options.model || "llama-3.1-8b-instant", // Updated Groq model
    messages,
    max_tokens: options.maxTokens || 800,
    temperature: options.temperature || 0.7,
  });
  
  return {
    content: completion.choices[0].message.content,
    usage: completion.usage,
    provider: AI_PROVIDERS.GROQ
  };
};

// xAI (Grok) completion
const createXAICompletion = async (client, messages, options) => {
  const completion = await client.chat.completions.create({
    model: options.model || "grok-beta", // xAI Grok model
    messages,
    max_tokens: options.maxTokens || 800,
    temperature: options.temperature || 0.7,
    stream: false,
  });
  
  return {
    content: completion.choices[0].message.content,
    usage: completion.usage,
    provider: AI_PROVIDERS.XAI
  };
};

// Ollama completion (local/free)
const createOllamaCompletion = async (client, messages, options) => {
  const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
  
  const response = await fetch(`${client.baseURL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: client.model,
      prompt: prompt,
      stream: false,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  return {
    content: data.response,
    usage: { total_tokens: 0 }, // Ollama doesn't provide usage stats
    provider: AI_PROVIDERS.OLLAMA
  };
};

// Hugging Face completion (free with limits)
const createHuggingFaceCompletion = async (client, messages, options) => {
  const prompt = messages[messages.length - 1].content; // Use last message as prompt
  
  const response = await fetch(`https://api-inference.huggingface.co/models/${client.model}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${client.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_length: options.maxTokens || 800,
        temperature: options.temperature || 0.7,
      },
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  return {
    content: data[0]?.generated_text || 'No response generated',
    usage: { total_tokens: 0 },
    provider: AI_PROVIDERS.HUGGINGFACE
  };
};

// Mock completion for development
const createMockCompletion = async (messages, options) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
  
  const userMessage = messages[messages.length - 1].content.toLowerCase();
  
  // Generate contextual mock responses based on user questions
  let mockResponse = "";
  
  if (userMessage.includes('save') || userMessage.includes('saving')) {
    mockResponse = "Great question about saving money! Here are some personalized tips:\n\n" +
      "💰 **Immediate Actions:**\n" +
      "• Review your subscription services - cancel unused ones\n" +
      "• Try the 24-hour rule before non-essential purchases\n" +
      "• Set up automatic transfers to savings (even ₹500/month helps!)\n\n" +
      "📊 **Based on your spending patterns:**\n" +
      "• Consider meal planning to reduce food expenses\n" +
      "• Look for free entertainment alternatives\n" +
      "• Use the envelope method for discretionary spending";
      
  } else if (userMessage.includes('overspend') || userMessage.includes('over') || userMessage.includes('exceed')) {
    mockResponse = "Let me analyze your spending patterns:\n\n" +
      "⚠️ **Areas to watch:**\n" +
      "• Entertainment category seems to be trending higher\n" +
      "• Food expenses have increased by 15% this month\n\n" +
      "✅ **Good news:**\n" +
      "• Your overall budget utilization is still manageable\n" +
      "• Transportation costs are well under control\n\n" +
      "💡 **Quick fixes:**\n" +
      "• Set weekly spending alerts for problem categories\n" +
      "• Try a 'no-spend' challenge for 3 days";
      
  } else if (userMessage.includes('biggest') || userMessage.includes('largest') || userMessage.includes('most')) {
    mockResponse = "Here's your spending breakdown:\n\n" +
      "🏆 **Top Expense Categories:**\n" +
      "1. **Food & Dining** - ₹8,500 (35% of budget)\n" +
      "2. **Transportation** - ₹4,200 (18% of budget)\n" +
      "3. **Entertainment** - ₹3,800 (16% of budget)\n\n" +
      "📈 **Insights:**\n" +
      "• Food is your largest expense - consider meal prep\n" +
      "• Transportation costs are reasonable\n" +
      "• Entertainment spending has room for optimization\n\n" +
      "🎯 **Action items:**\n" +
      "• Set a weekly food budget of ₹2,000\n" +
      "• Find 2-3 free entertainment activities";
      
  } else if (userMessage.includes('realistic') || userMessage.includes('budget')) {
    mockResponse = "Let me evaluate your budget setup:\n\n" +
      "✅ **What's working well:**\n" +
      "• Your total budget aligns with typical spending patterns\n" +
      "• You've allocated funds across essential categories\n" +
      "• Emergency buffer seems reasonable\n\n" +
      "⚖️ **Areas for adjustment:**\n" +
      "• Consider increasing your savings allocation by 5%\n" +
      "• Food budget might be slightly optimistic\n" +
      "• Add a 'miscellaneous' category for unexpected expenses\n\n" +
      "🔧 **Recommendations:**\n" +
      "• Start with 80% of current budget targets\n" +
      "• Adjust upward after 2-3 months of data";
      
  } else if (userMessage.includes('tip') || userMessage.includes('advice') || userMessage.includes('help')) {
    const tips = [
      "🎯 **Smart Spending Tip:**\nUse the 'cost per use' method - divide item price by expected uses. A ₹2000 jacket worn 50 times costs ₹40 per wear!",
      
      "💡 **Budgeting Hack:**\nTry the 'pay yourself first' method - save money immediately when you get paid, before any spending.",
      
      "📱 **Tech Tip:**\nSet up spending alerts on your phone. Get notified when you're at 75% of any budget category.",
      
      "🛒 **Shopping Strategy:**\nMake a list and stick to it. Impulse purchases account for 40% of overspending.",
      
      "⏰ **Time-based Tip:**\nImplement 'money dates' - spend 15 minutes weekly reviewing your expenses and celebrating wins."
    ];
    
    mockResponse = tips[Math.floor(Math.random() * tips.length)];
    
  } else {
    // Default personalized response
    mockResponse = "I'm here to help with your financial questions! 💰\n\n" +
      "📊 **Your Financial Snapshot:**\n" +
      "• Budget utilization: 67% (healthy range)\n" +
      "• Savings rate: 12% (good progress!)\n" +
      "• Top category: Food & Dining\n\n" +
      "🎯 **Quick Wins:**\n" +
      "• You're doing great with transportation costs\n" +
      "• Consider automating your savings\n" +
      "• Track daily expenses for better insights\n\n" +
      "💬 **Ask me about:**\n" +
      "• Saving strategies • Budget optimization • Expense analysis • Financial goals";
  }
  
  return {
    content: mockResponse,
    usage: { total_tokens: mockResponse.length / 4 }, // Rough token estimate
    provider: AI_PROVIDERS.MOCK
  };
};

/**
 * Generate financial insights using AI
 */
export const generateFinancialInsights = async (financialData, userQuestion = null) => {
  try {
    const systemPrompt = `You are a professional financial advisor AI assistant. You help users manage their personal finances by analyzing their budget and spending data.

Your role is to:
1. Provide personalized financial advice based on their actual data
2. Identify spending patterns and potential issues
3. Suggest practical money management strategies
4. Help users optimize their budgets
5. Answer questions about their financial health

Always be:
- Supportive and encouraging
- Practical and actionable
- Clear and easy to understand
- Focused on their specific data
- Professional but friendly

Use Indian Rupees (₹) for all monetary values.`;

    const hasData = financialData.budgets.length > 0 || financialData.recentTransactions.length > 0;
    
    let dataContext;
    if (!hasData) {
      dataContext = `The user is new and hasn't created any budgets or transactions yet. This is their first time using the financial tracker.`;
    } else {
      dataContext = `Here is the user's current financial data:

BUDGET SUMMARY:
- Total Budget: ₹${financialData.summary.totalBudget}
- Total Spent: ₹${financialData.summary.totalSpent}
- Remaining Budget: ₹${financialData.summary.remainingBudget}
- Budget Utilization: ${financialData.summary.budgetUtilizationPercentage.toFixed(1)}%
- Total Transactions: ${financialData.summary.totalTransactions}
- Average Transaction: ₹${financialData.summary.averageTransactionAmount.toFixed(2)}

BUDGETS BREAKDOWN:
${financialData.budgets.length > 0 ? financialData.budgets.map(budget => 
  `- ${budget.name} (${budget.category || 'No category'}): ₹${budget.totalSpend}/₹${budget.amount} (${budget.utilizationPercentage.toFixed(1)}% used)`
).join('\n') : 'No budgets created yet'}

SPENDING BY CATEGORY:
${financialData.categorySpending.length > 0 ? financialData.categorySpending.map(cat => 
  `- ${cat.category || 'Uncategorized'}: ₹${cat.totalAmount} (${cat.transactionCount} transactions)`
).join('\n') : 'No spending categories yet'}

RECENT TRANSACTIONS (Last 30 days):
${financialData.recentTransactions.length > 0 ? financialData.recentTransactions.slice(0, 10).map(t => 
  `- ${t.name}: ₹${t.amount} (${t.category || 'No category'}) - ${new Date(t.createdAt).toLocaleDateString()}`
).join('\n') : 'No recent transactions'}

MONTHLY SPENDING TREND:
${financialData.monthlySpending.length > 0 ? financialData.monthlySpending.map(m => 
  `- ${m.month}: ₹${m.totalAmount}`
).join('\n') : 'No spending history yet'}`;
    }

    let userPrompt;
    if (userQuestion) {
      userPrompt = `The user asked: "${userQuestion}"

Please answer their question based on their financial data and provide relevant insights and recommendations.`;
    } else {
      userPrompt = `Please analyze this financial data and provide:
1. Overall financial health assessment
2. Key insights about spending patterns
3. Specific recommendations for improvement
4. Areas of concern (if any)
5. Positive aspects to acknowledge

Keep your response concise but comprehensive, around 300-400 words.`;
    }

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `${dataContext}\n\n${userPrompt}` }
    ];

    try {
      const completion = await createChatCompletion(messages, {
        maxTokens: 800,
        temperature: 0.7
      });

      return {
        success: true,
        response: completion.content,
        usage: completion.usage,
        provider: completion.provider,
      };
    } catch (apiError) {
      console.warn(`Primary AI provider failed, falling back to mock: ${apiError.message}`);
      
      // Fallback to mock provider
      const mockCompletion = await createMockCompletion(messages, {});
      return {
        success: true,
        response: mockCompletion.content,
        usage: mockCompletion.usage,
        provider: `${getAIProvider()}-fallback-mock`,
      };
    }

  } catch (error) {
    console.error('Error generating AI insights:', error);
    return {
      success: false,
      error: error.message,
      response: "I'm sorry, I couldn't analyze your financial data at the moment. Please try again later.",
    };
  }
};

/**
 * Generate quick financial tips based on data patterns
 */
export const generateQuickTips = async (financialData) => {
  try {
    const systemPrompt = `You are a financial advisor. Based on the user's spending data, provide 3-5 quick, actionable financial tips. Each tip should be:
- One sentence long
- Specific to their data
- Actionable
- Encouraging

Format as a simple array of strings.`;

    const dataContext = `Budget utilization: ${financialData.summary.budgetUtilizationPercentage.toFixed(1)}%
Top spending categories: ${financialData.categorySpending.slice(0, 3).map(c => c.category || 'Uncategorized').join(', ')}
Overspent budgets: ${financialData.budgets.filter(b => b.utilizationPercentage > 100).length}
Total remaining budget: ₹${financialData.summary.remainingBudget}`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: dataContext }
    ];

    const completion = await createChatCompletion(messages, {
      maxTokens: 300,
      temperature: 0.8
    });

    // Parse the response to extract tips
    const response = completion.content;
    const tips = response.split('\n').filter(tip => tip.trim().length > 0).slice(0, 5);

    return {
      success: true,
      tips: tips.map(tip => tip.replace(/^[-•*]\s*/, '').trim()),
      provider: completion.provider,
    };

  } catch (error) {
    console.error('Error generating quick tips:', error);
    return {
      success: true, // Return success with fallback tips
      tips: [
        "Track your spending regularly to stay within budget",
        "Consider setting up automatic savings transfers",
        "Review and adjust your budgets monthly",
      ],
    };
  }
};