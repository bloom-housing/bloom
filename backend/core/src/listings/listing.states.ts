import { createMachine } from "@xstate/fsm"
import { Listing } from "./entities/listing.entity"
import { previewSchema, publishSchema } from "./listing.schema"
import { ListingStatus } from "./types/listing-status-enum"
import { ListingCreateDto } from "./dto/listing.dto"

export interface ListingContext {
  listing?: Listing | ListingCreateDto
  errors?: string[]
}

const canPreview = (context: ListingContext) => {
  try {
    previewSchema.validateSync(context.listing)
  } catch (err) {
    context.errors = err.errors
    return false
  }

  return true
}

const canPublish = (context: ListingContext) => {
  try {
    publishSchema.validateSync(context.listing)
  } catch (err) {
    context.errors = err.errors
    return false
  }

  return true
}

const initiateStateMachine = (context: ListingContext) => {
  const machine = createMachine({
    id: "listing",
    initial: context.listing.status || ListingStatus.new,
    context: context,
    states: {
      new: {
        on: {
          PREVIEW: {
            target: "pending",
            cond: (listing) => canPreview(listing),
          },
        },
      },
      pending: {
        on: {
          PUBLISH: {
            target: "active",
            cond: (listing) => canPublish(listing),
          },
          PREVIEW: {
            target: "pending",
            cond: (listing) => canPreview(listing),
          },
        },
      },
      active: {
        on: {
          PREVIEW: { target: "pending", cond: (listing) => canPreview(listing) },
          PUBLISH: {
            target: "active",
            cond: (listing) => canPublish(listing),
          },
          CLOSE: { target: "closed" },
        },
      },
      closed: { on: {} },
    },
  })

  return machine
}

const transitionState = (context: ListingContext, newState: ListingStatus) => {
  switch (newState) {
    case ListingStatus.active: {
      return publish(context)
    }
    case ListingStatus.pending: {
      return preview(context)
    }
    case ListingStatus.closed: {
      return close(context)
    }
  }
}

const handleResult = (result, context: ListingContext) => {
  context.listing.status = result.value
}

const execute = (action: string, context: ListingContext) => {
  const stateMachine = initiateStateMachine(context)
  const { initialState } = stateMachine
  const result = stateMachine.transition(initialState, action)
  handleResult(result, context)
  return context
}

const preview = (context: ListingContext) => execute("PREVIEW", context)

const publish = (context: ListingContext) => execute("PUBLISH", context)

const close = (context: ListingContext) => execute("CLOSE", context)

export { preview, publish, close, transitionState }
