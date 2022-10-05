// /// <reference types="Cypress" />
/*
    USAGE:
        npx cypress open
*/


const passwordService = require("../../services/service.password");

const { assert } = require("chai")




describe("Login tests", function() {




  it.skip("Show invalid username or password error when use invalid credentials", function() {
    cy.visit("http://localhost:3000/login")
    cy.get('input[id="input_username"').type('usernotexist')
    cy.get('input[id="input_password"').type('usernotexist')
    cy.get('#button_login').click();
    cy.get('.alert > p').should('contain','Incorrect username or password, or account is not active', { matchCase: false })
    cy.get('.alert > p').should('contain','Error:', { matchCase: false })
    //cy.get('#close').click();
  })

  it.skip("Show invalid username or password error when user not active", function() {
    cy.visit("http://localhost:3000/login")
    cy.get('input[id="input_username"').type('inactiveuser1')
    cy.get('input[id="input_password"').type('inactiveuser1')
    cy.get('#button_login').click();
    cy.get('.alert > p').should('contain','Incorrect username or password, or account is not active', { matchCase: false })
    cy.get('.alert > p').should('contain','Error:', { matchCase: false })
    //cy.get('#close').click();
  })

  it.skip("Can login with valid credentials then logout", function() {
    cy.visit("http://localhost:3000/login")
    cy.get('input[id="input_username"').type('s')
    cy.get('input[id="input_password"').type('s')
    cy.get('#button_login').click();
    cy.get('h1').should('contain',"Dashboard", { matchCase: true })
    cy.url().should('contain','/dashboard')
    cy.get('p[id="topnavproperties.username"]').should('contain',"topnavproperties.username=s", { matchCase: true })
    cy.get('p[id="topnavproperties.page"]').should('contain',"topnavproperties.page=dashboard", { matchCase: true })
    cy.get('p[id="topnavproperties.permissions"]').should('contain','topnavproperties.permissions=system', { matchCase: true })
    cy.get('a[id="link_logout"').click();
    cy.url().should('eq','http://localhost:3000/')
    cy.get('h1').should('contain','Index', { matchCase: true })
  })


  it("Can add user as system", async function() {

    // login system
    const uid = await passwordService.generateUUID();
    const new_username =  uid 
    const new_email = uid + `@mail.com`;
    const new_password = "password1";

    login("s","s");

    // click users
    cy.get('a[id="link_users"').click();
    cy.url().should('contain','/admin/users')

    // assert users pages displayed
    cy.get('h1').should('contain','Users', { matchCase: false })
    cy.get('a[id="link_user_add"').click();

    // Input values, click save
    cy.get('h1').should('contain','Add user', { matchCase: true })
    cy.get('input[id="input_username"').type(new_username)
    cy.get('input[id="input_email"').type(new_email)
    cy.get('input[id="input_password"').type(new_password)
    cy.get('input[id="input_confirmpassword"').type(new_password)
    cy.get('button[id="button_save"').click();

    // Changes saved, edit user page displayed, check values
    cy.url().should('contain','/admin/user/edit?id=')
    cy.get('input[id="input_username"').should('contain',new_username, { matchCase: true })
    cy.get('input[id="input_email"').should('contain', new_email, { matchCase: true })
    cy.get('select[id="select_status"').should('contain',"active", { matchCase: true })

    // TODO: change value then click save, this does notr work
    //cy.get('input[id="input_username"').clear()
    //cy.get('input[id="input_email"').clear()

    //cy.get('input[id="input_username"').type(new_username + "UPDATE")
    //cy.get('input[id="input_email"').type(new_email + "UPDATE")
    //cy.get('input[id="input_username"').should('contain', "UPDATE", { matchCase: true })
    //cy.get('input[id="input_email"').should('contain', "UPDATE", { matchCase: true })
    cy.get('button[id="button_save"').click();


  })


  

})

function logout(){
  cy.visit("http://localhost:3000/logout")
}

// login system
function login(username, password) {
    cy.visit("http://localhost:3000/login")
    cy.get('input[id="input_username"').type(username)
    cy.get('input[id="input_password"').type(password)
    cy.get('#button_login').click();
    cy.get('h1').should('contain',"Dashboard", { matchCase: true })
    cy.url().should('eq','http://localhost:3000/dashboard')
}