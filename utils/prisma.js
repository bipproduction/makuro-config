/**
 * @type {import('@prisma/client').PrismaClient}
 */
let prisma;

// check if prisma is already declared
if (!global.prisma) {
    global.prisma = new (require('@prisma/client')).PrismaClient();
    prisma = global.prisma;
}

// export prisma
module.exports = prisma;
