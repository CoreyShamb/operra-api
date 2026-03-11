import { prisma } from "./prisma";

async function main() {
    const org = await prisma.organization.create({
        data: {
            name: "Operra Dev Org"
        }
    });

    console.log("Organization created:");
    console.log(org);
}

main()
    .catch((err) => {
        console.error(err);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });