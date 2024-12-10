import { ShareDoEvent, fireEvent } from "./EventsHelper";

// Mock the $ui object
const mockUi = {
  events: {
    broadcast: jest.fn(),
  },
};

// Create a spy on the global $ui object to return the mockUi
const originalUi = global.$ui;
global.$ui = mockUi;

// Restore the original $ui object after the tests
afterAll(() => {
  global.$ui = originalUi;
});

describe('fireEvent function', () => {
  it('should call $ui.events.broadcast with the provided event', () => {
    const event: ShareDoEvent = {
      componentId:"",
      eventPath: 'MatterSearch.Changed',
      eventName: 'Changed',
      dataLocation:"",
      source: null,
      data: { someData: 'value' },
    };

    fireEvent(event);

    // Check if $ui.events.broadcast was called with the expected arguments
    expect(mockUi.events.broadcast).toHaveBeenCalledWith(
      event.eventPath,
      event
    );

    // You can also check how many times it was called
    expect(mockUi.events.broadcast).toHaveBeenCalledTimes(1);
    
  });
});
