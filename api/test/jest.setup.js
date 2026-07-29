// the juice library is used to inline CSS in HTML emails, but it doesn't work in the test environment. This mock allows us to bypass that functionality for testing purposes.
jest.mock('juice', () => (html) => html);
