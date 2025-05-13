const {PrismaClient}= require("@prisma/client")

const database= new PrismaClient();

async  function main(){
    try {
        await database.category.createMany({
            data: [
                {
                    name: "Computer Science",
                },
                {name: "Music"},
                {name: "Fitness"},
                {name: "Accounting"},
                {name: "Filming"},
                {name: "Engineering"},
                {name: "Photography"},
            ]
        });
        console.log("sucess");
    } catch (error) {
        console.log("Error sending the database category", error)

    }finally{
        await database.$disconnect()
    }
}
main()