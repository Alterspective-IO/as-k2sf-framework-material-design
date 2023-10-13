import { Framework } from "../Models/framework";

test("Framework",() =>
{
    let as = new Framework(window,"","")
    expect(window.as).toBe(as)
})