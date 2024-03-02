/// <reference types="cypress"/>


describe("Network Requests", () => {
    let message = "Unable to find comment";
    //  hook
    beforeEach(() => {
        cy.visit("https://example.cypress.io/commands/network-requests");
    });
    
    it("Get request", () => {
        // intercept is basically used for intercepting the network request
        cy.intercept({
                method: "GET",
                url: "**/comments/*",
            },
            //here i mock the response body by my own response  
            {
                body: {
                    postId: 1,
                    id: 1,
                    name: "test name 123",
                    email: "joe_blogs123@test.com",
                    body: "Hello world"
                }

            }).as("getComment");


        cy.get(".network-btn").click();
        // here I check the status of the response that I get 
        cy.wait("@getComment").its("response.statusCode").should("eq", 200);
    });

    // for post request 
    it("Post Request", () => {
        cy.intercept("POST", "/comments").as("postcomment");
        cy.get(".network-post").click();
        // here the paramter request,response is map the network request and response section
        cy.wait("@postcomment").should(({ request, response }) => {
            console.log(request);

            expect(request.body).to.include("email");

            // now here I assert the response 
            console.log(response);

            expect(response.body).to.have.property("name", "Using POST in cy.intercept()")
            expect(request.headers).to.have.property("content-type");
            expect(request.headers).to.have.property("origin", "https://example.cypress.io");

        });
    });
    it("Put request", () => {
        cy.intercept({
            method: 'PUT',
            url: "**/comments/*"
        }, {
            statusCode: 404,
            body: {
                error: message
            },
            delay: 500
        }).as("putComment");
        cy.get(".network-put").click();
        cy.wait("@putComment");

        cy.get(".network-put-comment").should("contain", message);
    });

})