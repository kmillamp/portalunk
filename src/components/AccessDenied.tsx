import React from 'react'
import { Shield, Mail, Phone } from 'lucide-react'

interface AccessDeniedProps {
  message: string
  resource?: string
  showContact?: boolean
}

export default function AccessDenied({ 
  message, 
  resource, 
  showContact = false 
}: AccessDeniedProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="glass rounded-2xl p-12 text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
          <Shield className="w-10 h-10 text-red-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">
          Acesso Restrito
        </h2>
        
        <p className="text-gray-400 mb-6">
          {message}
        </p>
        
        {resource && (
          <p className="text-sm text-purple-400 mb-6">
            Recurso solicitado: <span className="font-mono">{resource}</span>
          </p>
        )}
        
        {showContact && (
          <div className="space-y-4">
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Precisa de acesso?
              </h3>
              <div className="space-y-3">
                <a 
                  href="mailto:admin@unk.com"
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-xl hover:bg-purple-600/30 transition-colors"
                >
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400">admin@unk.com</span>
                </a>
                <a 
                  href="tel:+5511999990000"
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl hover:bg-blue-600/30 transition-colors"
                >
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400">(11) 99999-0000</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
