@isTest
public with sharing class ContactControllerTest {
    @isTest
    static void testGetContacts() {
        // Create a test account
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;

        // Create two test contacts
        Contact testContact1 = new Contact(LastName = 'Test1', AccountId = testAccount.Id);
        Contact testContact2 = new Contact(LastName = 'Test2', AccountId = testAccount.Id);
        insert new List<Contact>{testContact1, testContact2};

        // Call the method to test
        List<Contact> contacts = ContactController.getContacts(testAccount.Id);

        // Verify the results
        System.assertEquals(2, contacts.size(), 'There should be two contacts for the test account');
        System.assertEquals(testContact2.Id, contacts[0].Id, 'The contacts should be ordered by creation date descending');
    }
}