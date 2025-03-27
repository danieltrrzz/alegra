const mongoose = require("mongoose");
const database = require("../../src/config/database");

jest.mock("mongoose");

describe("connectDB", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should connect to MongoDB successfully", async () => {
    mongoose.connect.mockResolvedValueOnce();

    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await database.connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(expect.any(String), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    expect(consoleLogSpy).toHaveBeenCalledWith("✅ Conectado a MongoDB");

    consoleLogSpy.mockRestore();
  });

  it("should handle connection errors", async () => {
    const error = new Error("Connection failed");
    mongoose.connect.mockRejectedValueOnce(error);

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await database.connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(expect.any(String), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith("❌ Error de conexión a MongoDB", error);

    consoleErrorSpy.mockRestore();
  });
});