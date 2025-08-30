import type { User, DJ, Event, Contract, Media } from '@/types'

export class AccessControlManager {
  static getUserPermissions(user: User) {
    if (user.role === 'admin') {
      return {
        canViewAllDJs: true,
        canViewAllEvents: true,
        canViewAllContracts: true,
        canManageUsers: true,
        canCreateDJs: true,
        canEditDJs: true,
        canViewFinancials: true,
        canManageProducers: true
      }
    }
    
    if (user.role === 'produtor') {
      return {
        canViewAllDJs: false,
        canViewAllEvents: false,
        canViewAllContracts: false,
        canManageUsers: false,
        canCreateDJs: false,
        canEditDJs: false,
        canViewFinancials: false,
        canManageProducers: false
      }
    }
    
    return {}
  }

  static canAccessDJ(user: User, djId: string, events: Event[]): boolean {
    if (user.role === 'admin') {
      return true
    }
    
    if (user.role === 'produtor' && user.producer_id) {
      // Produtor só pode ver DJs que já contratou
      return events.some(event => 
        event.dj_id === djId && event.producer_id === user.producer_id
      )
    }
    
    return false
  }

  static filterDJs(djs: DJ[], events: Event[], user: User): DJ[] {
    if (user.role === 'admin') {
      return djs
    }
    
    if (user.role === 'produtor' && user.producer_id) {
      const accessibleDjIds = new Set(
        events
          .filter(event => event.producer_id === user.producer_id)
          .map(event => event.dj_id)
          .filter(Boolean)
      )
      
      return djs.filter(dj => accessibleDjIds.has(dj.id))
    }
    
    return []
  }

  static filterEvents(events: Event[], user: User): Event[] {
    if (user.role === 'admin') {
      return events
    }
    
    if (user.role === 'produtor' && user.producer_id) {
      return events.filter(event => event.producer_id === user.producer_id)
    }
    
    return []
  }

  static filterContracts(contracts: Contract[], user: User): Contract[] {
    if (user.role === 'admin') {
      return contracts
    }
    
    if (user.role === 'produtor' && user.producer_id) {
      return contracts.filter(contract => contract.producer_id === user.producer_id)
    }
    
    return []
  }

  static filterMedia(media: Media[], djs: DJ[], events: Event[], user: User): Media[] {
    if (user.role === 'admin') {
      return media
    }
    
    if (user.role === 'produtor' && user.producer_id) {
      const accessibleDjIds = new Set(
        events
          .filter(event => event.producer_id === user.producer_id)
          .map(event => event.dj_id)
          .filter(Boolean)
      )
      
      const accessibleEventIds = new Set(
        events
          .filter(event => event.producer_id === user.producer_id)
          .map(event => event.id)
      )
      
      return media.filter(item => 
        (item.dj_id && accessibleDjIds.has(item.dj_id)) ||
        (item.event_id && accessibleEventIds.has(item.event_id))
      )
    }
    
    return []
  }
}
