// Console utility for production builds
// This file handles console log suppression in production

// Store original console methods
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
  debug: console.debug,
  trace: console.trace,
  table: console.table,
  group: console.group,
  groupEnd: console.groupEnd,
  time: console.time,
  timeEnd: console.timeEnd,
  count: console.count,
  clear: console.clear
};

// Disable console methods in production
if (process.env.NODE_ENV === 'production') {
  // Override all console methods except error (for critical issues)
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.debug = () => {};
  console.trace = () => {};
  console.table = () => {};
  console.group = () => {};
  console.groupEnd = () => {};
  console.time = () => {};
  console.timeEnd = () => {};
  console.count = () => {};
  console.clear = () => {};
  
  // Keep console.error for critical errors in production
  // console.error remains unchanged
}

// Development helper function
export const enableConsoleInDev = () => {
  if (process.env.NODE_ENV === 'development') {
    // Restore original console methods in development
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.info = originalConsole.info;
    console.debug = originalConsole.debug;
    console.trace = originalConsole.trace;
    console.table = originalConsole.table;
    console.group = originalConsole.group;
    console.groupEnd = originalConsole.groupEnd;
    console.time = originalConsole.time;
    console.timeEnd = originalConsole.timeEnd;
    console.count = originalConsole.count;
    console.clear = originalConsole.clear;
  }
};

// Production-safe logging function
export const safeLog = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(message, ...args);
  }
  // In production, this does nothing
};

export const safeWarn = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(message, ...args);
  }
  // In production, this does nothing
};

export const safeError = (message: string, ...args: any[]) => {
  // Always log errors, even in production
  console.error(message, ...args);
};
