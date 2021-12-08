import { Ticket } from "../Ticket";

test("implements optimistic concurrency control", async () => {
    const ticket = await Ticket.createTicket({
        title: "concert",
        price: "20",
        userId: "123",
    });

    expect(ticket.version).toEqual(0);

    const firstInstance = await Ticket.findById(ticket.id); //  fetches the ticket with version number 0
    const secondInstance = await Ticket.findById(ticket.id); //  fetches the ticket with version number 0

    firstInstance!.set({ price: "100" });
    await firstInstance!.save(); // updates the ticket with version number 0 to version number 1

    const thirdInstance = await Ticket.findById(ticket.id);
    expect(thirdInstance!.version).toEqual(1);

    secondInstance!.set({ price: "200" });
    // await secondInstance!.save();
    // also updates the ticket with version number 0 to version number 1,
    // but there is not record in database with given id and version number 0
    // (VersionError: No matching document found for id "61acc6f02e4a72702c49b812" version 0 modifiedPaths "price")

    // expect(async () => await secondInstance!.save()).toThrow(); // throws VersionError

    try {
        await secondInstance!.save();
    } catch (err: any) {
        expect(err.message).toEqual(
            `No matching document found for id "${ticket.id}" version 0 modifiedPaths "price"`
        );
    }
});
