import winston from 'winston'
import util from "util";

export function ConsoleLogger(console: boolean) {
    return winston.createLogger({
        level: "info",
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            //one line logging
            // winston.format.printf(({ level, message, timestamp, ...meta }) => {
            //     return `[${timestamp}] ${level.toUpperCase()}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""
            //         }`;
            // })

            //multi line logging
            winston.format.printf((info) => {
                const { level, message, timestamp, stack, [Symbol.for('splat')]: splat } = info as any;

                let meta = "";

                if (splat && splat.length) {
                    meta = splat
                        .map((v: any) => util.inspect(v, {
    showHidden: false,//true for more details
    depth: null,
    colors: false
}))
                        .join("\n");
                }

                return `[${timestamp}] ${level.toUpperCase()}: ${message} \n`
                    + (stack ? `\n${stack}` : "")
                    + (meta ? `\n${meta}` : "");
            })
        ),
        transports: [new winston.transports.Console()]
    })
}

const FileLogger: Map<string, winston.Logger> = new Map()
 function CreateFileLoggerMap(file: boolean): Map<string, winston.Logger> {
    const comps: Array<string> = ["login"]
    if (file) {
        for (const l of comps) {
            const logger = CreateFileLogger(l + ".log")
            FileLogger.set(l, logger)
        }
        return FileLogger
    } else {
        return FileLogger
    }

}


export function CreateFileLogger(fileName: string): winston.Logger {
    return winston.createLogger({
        level: "info",
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            //one line logging
            // winston.format.printf(({ level, message, timestamp, ...meta }) => {
            //     return `[${timestamp}] ${level.toUpperCase()}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""
            //         }`;
            // })

            //multi line logging
            winston.format.printf((info) => {
                const { level, message, timestamp, stack, [Symbol.for('splat')]: splat } = info as any;

                let meta = "";

                if (splat && splat.length) {
                    meta = splat
                        .map((v: any) => JSON.stringify(v, null, 2))
                        .join("\n");
                }

                return `[${timestamp}] ${level.toUpperCase()}: ${message} \n`
                    + (stack ? `\n${stack}` : "")
                    + (meta ? `\n${meta}` : "");
            })
        ),
        transports: [new winston.transports.File({ filename: fileName })]
    })
}


