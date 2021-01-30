// TODO use EventEmitter for an async Logger instead

enum LogLevel {
  Info = 'INFO',
  Debug = 'DEBUG',
  Warn = 'WARN',
  Error = 'ERROR',
}

type LogMessage = {
  level: LogLevel;
  timestamp: string;
  message: string;
};

export default class Logger {
  public static info(msg: string): void {
    Logger.log(LogLevel.Info, msg);
  }

  public static debug(msg: string): void {
    Logger.log(LogLevel.Debug, msg);
  }

  public static warn(msg: string): void {
    Logger.log(LogLevel.Warn, msg);
  }

  public static error(msg: string): void {
    Logger.log(LogLevel.Error, msg);
  }

  private static log(logLevel: LogLevel, msg: string): void {
    if (process.env.CLERK_LOGGING == 'true') {
      const logMessage: LogMessage = {
        timestamp: new Date().toISOString(),
        level: logLevel,
        message: msg,
      };

      console.log(logMessage);
    }
  }
}
