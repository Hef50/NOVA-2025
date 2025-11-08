import { motion } from 'framer-motion'
import { Moon, Sun, Bell, Mail, DollarSign, Globe, Ruler } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { useTheme } from '../contexts/ThemeContext'
import { useSettings } from '../contexts/SettingsContext'

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { settings, updateSettings, resetSettings } = useSettings()

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF']
  const languages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese']

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 pt-16">
      <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                Settings
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-xl">
              Customize your Vacai experience
            </p>
          </motion.div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Appearance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
                  {theme === 'light' ? (
                    <Sun className="w-6 h-6 mr-3 text-orange-500" />
                  ) : (
                    <Moon className="w-6 h-6 mr-3 text-purple-500" />
                  )}
                  Appearance
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Choose between light and dark mode
                      </p>
                    </div>
                    <Button
                      onClick={toggleTheme}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {theme === 'light' ? (
                        <>
                          <Moon className="w-4 h-4" />
                          Dark Mode
                        </>
                      ) : (
                        <>
                          <Sun className="w-4 h-4" />
                          Light Mode
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
                  <Bell className="w-6 h-6 mr-3 text-purple-500" />
                  Notifications
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Receive trip reminders and updates
                      </p>
                    </div>
                    <Button
                      onClick={() => updateSettings({ notifications: !settings.notifications })}
                      variant={settings.notifications ? 'default' : 'outline'}
                      className={settings.notifications ? 'bg-gradient-to-r from-purple-600 to-orange-500' : ''}
                    >
                      {settings.notifications ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Updates
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Get travel tips and destination news
                      </p>
                    </div>
                    <Button
                      onClick={() => updateSettings({ emailUpdates: !settings.emailUpdates })}
                      variant={settings.emailUpdates ? 'default' : 'outline'}
                      className={settings.emailUpdates ? 'bg-gradient-to-r from-purple-600 to-orange-500' : ''}
                    >
                      {settings.emailUpdates ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Regional Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
                  <Globe className="w-6 h-6 mr-3 text-orange-500" />
                  Regional Settings
                </h2>
                
                <div className="space-y-6">
                  {/* Currency */}
                  <div>
                    <label className="flex items-center font-medium text-gray-900 dark:text-white mb-3">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Currency
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {currencies.map(currency => (
                        <Button
                          key={currency}
                          onClick={() => updateSettings({ currency })}
                          variant={settings.currency === currency ? 'default' : 'outline'}
                          className={settings.currency === currency ? 'bg-gradient-to-r from-purple-600 to-orange-500' : ''}
                        >
                          {currency}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="flex items-center font-medium text-gray-900 dark:text-white mb-3">
                      <Globe className="w-4 h-4 mr-2" />
                      Language
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {languages.map(language => (
                        <Button
                          key={language}
                          onClick={() => updateSettings({ language })}
                          variant={settings.language === language ? 'default' : 'outline'}
                          className={settings.language === language ? 'bg-gradient-to-r from-purple-600 to-orange-500' : ''}
                        >
                          {language}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Distance Unit */}
                  <div>
                    <label className="flex items-center font-medium text-gray-900 dark:text-white mb-3">
                      <Ruler className="w-4 h-4 mr-2" />
                      Distance Unit
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => updateSettings({ distanceUnit: 'km' })}
                        variant={settings.distanceUnit === 'km' ? 'default' : 'outline'}
                        className={settings.distanceUnit === 'km' ? 'bg-gradient-to-r from-purple-600 to-orange-500' : ''}
                      >
                        Kilometers
                      </Button>
                      <Button
                        onClick={() => updateSettings({ distanceUnit: 'miles' })}
                        variant={settings.distanceUnit === 'miles' ? 'default' : 'outline'}
                        className={settings.distanceUnit === 'miles' ? 'bg-gradient-to-r from-purple-600 to-orange-500' : ''}
                      >
                        Miles
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Reset Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center pt-4"
            >
              <Button
                onClick={resetSettings}
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
              >
                Reset to Default Settings
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

