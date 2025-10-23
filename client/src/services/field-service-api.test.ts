import { FieldService } from "./field-service-api";

const mockFetch = jest.fn();
global.fetch = mockFetch as any;

describe("FieldService.saveField", () => {
  const mockData = { label: "Test", type: "Multi-select" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send POST request and return JSON response on success", async () => {
    const mockResponse = { message: "Field saved!" };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await FieldService.saveField(mockData);

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:4000/api/fields",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockData),
      })
    );

    expect(result).toEqual(mockResponse);
  });

  it("should throw error if response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(FieldService.saveField(mockData)).rejects.toThrow(
      "Server responded with 500"
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
