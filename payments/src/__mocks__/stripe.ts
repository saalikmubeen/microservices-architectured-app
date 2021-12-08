const stripe = {
    charges: {
        create: jest
            .fn()
            .mockResolvedValue({ id: "ch_3K47eE2eZvKYlo2C15Doplmi" }),
    },
};

export { stripe };
