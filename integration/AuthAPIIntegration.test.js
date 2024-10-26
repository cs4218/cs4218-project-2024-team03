import axios from "axios";
import { randomInt } from "crypto";

let token;
const baseUrl = "http://localhost:6060/api/v1";
const registerUrl = baseUrl + "/auth/register";
const loginUrl = baseUrl + "/auth/login";

const newUserEmail = `test${randomInt(10000)}@test.com`;

  it("should register a new user", async () => {
    const res = await axios({
        method: "POST",
        url: registerUrl,
        data: {
            name: "ecommlover",
            email: newUserEmail,
            password: "iloveecomm",
            phone: "1234567890",
            address: "ecomm street",
            answer: "I love ecomm",
        },
    });
    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    expect(res.data.message).toEqual("User Register Successfully");
    expect(res.data.user.name).toEqual("ecommlover");
    expect(res.data.user.email).toEqual(newUserEmail);
    expect(res.data.user.phone).toEqual("1234567890");
    expect(res.data.user.address).toEqual("ecomm street");
    });

    it("should not register a user with an existing email", async () => {
        const res = await axios({
            method: "POST",
            url: registerUrl,
            data: {
                name: "ecommlover",
                email: newUserEmail,
                password: "iloveecomm2",
                phone: "987654321",
                address: "ecomm avenue",
                answer: "I love ecomm too",
            },
        });
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(false);
        expect(res.data.message).toEqual("Already Register please login");
    });

    it("should login a user", async () => {
        const res = await axios({
            method: "POST",
            url: loginUrl,
            data: {
                email: newUserEmail,
                password: "iloveecomm"
            },
        });
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.token).toBeDefined();
        expect(res.data.user.name).toEqual("ecommlover");
        expect(res.data.user.email).toEqual(newUserEmail);
        expect(res.data.user.phone).toEqual("1234567890");
        expect(res.data.user.address).toEqual("ecomm street");
    });

    it("should not login a user with an invalid password", async () => {
        const res = await axios({
            method: "POST",
            url: loginUrl,
            data: {
                email: newUserEmail,
                password: "iloveecomm2"
            },
        });
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(false);
        expect(res.data.message).toEqual("Invalid Password");
    });

    it("should reset the password if the email matches with the answer", async () => {
        const res = await axios({
            method: "POST",
            url: baseUrl + "/auth/forgot-password",
            data: {
                email: newUserEmail,
                answer: "I love ecomm",
                newPassword: "iloveecomm3newpassword",
            },
        });
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.message).toEqual("Password Reset Successfully");
    }
    );

    it("should login a user with the new password", async () => {
        const res = await axios({
            method: "POST",
            url: loginUrl,
            data: {
                email: newUserEmail,
                password: "iloveecomm3newpassword"
            },
        });
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.token).toBeDefined();
        expect(res.data.user.name).toEqual("ecommlover");
        expect(res.data.user.email).toEqual(newUserEmail);
        expect(res.data.user.phone).toEqual("1234567890");
        expect(res.data.user.address).toEqual("ecomm street");
    });

});
