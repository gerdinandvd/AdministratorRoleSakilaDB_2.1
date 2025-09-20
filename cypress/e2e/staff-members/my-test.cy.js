/// <reference types="cypress" />

describe("example to-do app", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
  });

  it("should show login page and login successfully", () => {
    cy.contains("Login").should("be.visible");
    cy.get('input[name="username"]').type("gerdinand");
    cy.get('input[name="password"]').type("secret");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/staff");
    cy.get(".card")
      .should("have.length", 2)
      .each(($card) => {
        cy.wrap($card).should("be.visible");
      });
  });
});
