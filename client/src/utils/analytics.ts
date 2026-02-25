import posthog from "posthog-js";

function capture(event: string, properties?: Record<string, unknown>): void {
  try {
    posthog.capture(event, {
      ...properties,
      timestamp: new Date().toISOString(),
    });
  } catch {
    // PostHog not initialized
  }
}

export const Analytics = {
  rsvp: {
    lookupStarted: (firstName: string, lastName: string) => {
      capture("rsvp:lookup_started", {
        first_name: firstName,
        last_name: lastName,
      });
    },
    lookupFound: (groupCount: number, guestCount: number) => {
      capture("rsvp:lookup_found", {
        group_count: groupCount,
        guest_count: guestCount,
      });
    },
    lookupNotFound: () => {
      capture("rsvp:lookup_not_found");
    },
    formOpened: (groupId: string) => {
      capture("rsvp:form_opened", { group_id: groupId });
    },
    submitted: (
      groupId: string,
      guestCount: number,
      confirmCount: number,
      declineCount: number,
    ) => {
      capture("rsvp:submitted", {
        group_id: groupId,
        guest_count: guestCount,
        confirmed: confirmCount,
        declined: declineCount,
      });
    },
    submissionFailed: (error: string) => {
      capture("rsvp:submission_failed", { error });
    },
  },

  navigation: {
    pageViewed: (pageName: string) => {
      capture("navigation:page_viewed", {
        page_name: pageName,
        url: window.location.pathname,
      });
    },
  },

  admin: {
    loggedIn: () => {
      capture("admin:logged_in");
    },
    guestAdded: () => {
      capture("admin:guest_added");
    },
    guestUpdated: () => {
      capture("admin:guest_updated");
    },
    guestDeleted: () => {
      capture("admin:guest_deleted");
    },
    groupCreated: () => {
      capture("admin:group_created");
    },
    reminderSent: (type: string, count: number) => {
      capture("admin:reminder_sent", {
        reminder_type: type,
        recipient_count: count,
      });
    },
  },
};
