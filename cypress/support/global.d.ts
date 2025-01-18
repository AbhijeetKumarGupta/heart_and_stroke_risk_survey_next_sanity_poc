/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        getBySelector<E extends Node = HTMLLIElement>(
            selector: string | [string, string],
            options?: Partial<Loggable & Timeoutable & Withinable & Shadow>
        ): Chainable<JQuery<E>>;

        getInputFieldWithinDiv<E extends Node = HTMLLIElement>(
            selector: string
        ): Chainable<JQuery<E>>;
    }
}