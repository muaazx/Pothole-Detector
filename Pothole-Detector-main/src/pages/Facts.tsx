import { motion } from 'motion/react';
import { ShieldAlert, BookOpen, ExternalLink, AlertTriangle } from 'lucide-react';

export default function Facts() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-5xl space-y-10 py-6"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl font-display font-bold text-white mb-4">Why Pothole Radar is Essential</h1>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
          Potholes and deteriorating roads are more than just an inconvenience—they are a critical public safety hazard. Here are verified reports documenting the severe consequences of neglected road maintenance worldwide.
        </p>
      </div>

      <section className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="h-6 w-6 text-[var(--accent-primary)]" />
          <h2 className="text-xl font-semibold text-white">Verified Global Fatalities</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[var(--text-secondary)] border-b border-[var(--border-subtle)]">
              <tr>
                <th className="pb-3 pr-4 font-medium">Country</th>
                <th className="pb-3 pr-4 font-medium min-w-[120px]">Date Reported</th>
                <th className="pb-3 pr-4 font-medium min-w-[300px]">Incident Description</th>
                <th className="pb-3 font-medium">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-primary)]">
              <tr>
                <td className="py-4 pr-4 align-top">🇬🇧 United Kingdom</td>
                <td className="py-4 pr-4 align-top">April 2026</td>
                <td className="py-4 pr-4"><strong>Andrew Freakley (43)</strong> died after his motorcycle struck a pothole in Stoke-on-Trent. A coroner ruled the pothole directly contributed to the fatal crash. The defect had been reported twice before the accident but remained unrepaired.</td>
                <td className="py-4 align-top"><a href="https://people.com/dad-43-killed-freak-accident-involving-pothole-that-community-said-needed-to-be-fixed-twice-in-months-before-his-death-11936658" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[var(--accent-primary)] hover:underline">People <ExternalLink className="h-3 w-3" /></a></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 align-top">🇬🇧 United Kingdom</td>
                <td className="py-4 pr-4 align-top">15 Oct 2023</td>
                <td className="py-4 pr-4"><strong>Harry Colledge (84)</strong> died after his bicycle struck an <strong>87-metre road crack/pothole</strong> in Lancashire. The coroner concluded he would probably still be alive had the council repaired the defect, which had been visible for 14 years.</td>
                <td className="py-4 align-top"><a href="https://www.theguardian.com/uk-news/2023/oct/15/lancashire-county-council-criticised-for-not-fixing-pothole-blamed-for-cyclist-harry-colledge-death" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[var(--accent-primary)] hover:underline">The Guardian <ExternalLink className="h-3 w-3" /></a></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 align-top">🇬🇧 United Kingdom</td>
                <td className="py-4 pr-4 align-top">5 Mar 2014</td>
                <td className="py-4 pr-4"><strong>Martyn Uzzell</strong> was killed while cycling after hitting a pothole in North Yorkshire and being thrown into the path of a vehicle. The coroner said there was "no doubt whatsoever" the defect caused the crash.</td>
                <td className="py-4 align-top"><a href="https://www.cyclinguk.org/news/cyclist-killed-due-to-pothole-says-coroner" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[var(--accent-primary)] hover:underline">Cycling UK <ExternalLink className="h-3 w-3" /></a></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 align-top">🇬🇧 United Kingdom</td>
                <td className="py-4 pr-4 align-top">3 Nov 2021</td>
                <td className="py-4 pr-4"><strong>Algert Lleshi (22)</strong> died after his e-bike struck a deep pothole in Ashford, Kent. The coroner concluded the pothole caused the crash.</td>
                <td className="py-4 align-top"><a href="https://www.cyclingweekly.com/news/coroner-tells-inquest-that-pothole-caused-cyclists-death" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[var(--accent-primary)] hover:underline">Cycling Weekly <ExternalLink className="h-3 w-3" /></a></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 align-top">🇬🇧 United Kingdom</td>
                <td className="py-4 pr-4 align-top">14 Nov 2017</td>
                <td className="py-4 pr-4"><strong>Roger Hamer (83)</strong> died after falling from his bicycle when he hit a pothole in Greater Manchester. The coroner warned more cyclists could die without prompt repairs.</td>
                <td className="py-4 align-top"><a href="https://www.ciht.org.uk/news/coroner-warns-of-pothole-risk-to-cyclists/" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[var(--accent-primary)] hover:underline">CIHT <ExternalLink className="h-3 w-3" /></a></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 align-top">🇺🇸 United States</td>
                <td className="py-4 pr-4 align-top">26 Sept 2025</td>
                <td className="py-4 pr-4"><strong>Randy Lee Phelps (45)</strong> died weeks after crashing his electric scooter into a pothole in Portland, Oregon. Police officially classified it as a fatal traffic collision.</td>
                <td className="py-4 align-top"><a href="https://www.portland.gov/police/news/2025/9/26/ppb-investigating-delayed-fatal-death-e-scooter-rider" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[var(--accent-primary)] hover:underline">Portland.gov <ExternalLink className="h-3 w-3" /></a></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 align-top">🇨🇦 Canada</td>
                <td className="py-4 pr-4 align-top">9 Oct 2021</td>
                <td className="py-4 pr-4">A <strong>woman in her 60s</strong> died after her bicycle hit a pothole on Route 139 in Roxton, Quebec. She fell into the roadway and was struck by a vehicle.</td>
                <td className="py-4 align-top"><a href="https://globalnews.ca/news/8256240/a-cyclist-fatally-struck-after-falling-into-a-pothole-in-monteregie/" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[var(--accent-primary)] hover:underline">Global News <ExternalLink className="h-3 w-3" /></a></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 align-top">🇨🇦 Canada</td>
                <td className="py-4 pr-4 align-top">4 Oct 2017</td>
                <td className="py-4 pr-4">Following cyclist <strong>Clément Ouimet's</strong> death in Montreal, the Quebec coroner highlighted hazardous road infrastructure as a contributing concern.</td>
                <td className="py-4 align-top"><a href="https://globalnews.ca/news/4280282/cyclist-clement-ouimets-death-was-accidental-coroners-report/" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[var(--accent-primary)] hover:underline">Global News <ExternalLink className="h-3 w-3" /></a></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 align-top">🇺🇸 United States</td>
                <td className="py-4 pr-4 align-top">13 March 2026</td>
                <td className="py-4 pr-4">A <strong>46-year-old scooter rider</strong> was killed after hitting a pothole on Liberty Avenue in Queens, New York. The road had accumulated more than <strong>550 pothole complaints</strong> since 2020.</td>
                <td className="py-4 align-top"><a href="https://nypost.com/2026/03/13/us-news/scooter-driver-killed-on-pothole-ridden-nyc-street-that-faced-hundreds-of-complaints/" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[var(--accent-primary)] hover:underline">New York Post <ExternalLink className="h-3 w-3" /></a></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 align-top">🇮🇳 India</td>
                <td className="py-4 pr-4 align-top">Feb 2026</td>
                <td className="py-4 pr-4">India's Ministry of Road Transport reported <strong>9,438 pothole-related deaths between 2020 and 2024</strong>, with Uttar Pradesh accounting for over half of the fatalities.</td>
                <td className="py-4 align-top"><a href="https://timesofindia.indiatimes.com/india/potholes-killed-9438-from-2020-to-2024-govt/articleshow/128279774.cms" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[var(--accent-primary)] hover:underline">Times of India <ExternalLink className="h-3 w-3" /></a></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 align-top">🇿🇼 Zimbabwe</td>
                <td className="py-4 pr-4 align-top">Jan 2026</td>
                <td className="py-4 pr-4">Road safety reports linked Zimbabwe's deteriorating road network, including widespread potholes, to a broader road safety crisis that caused <strong>more than 2,000 traffic deaths in 2024</strong>.</td>
                <td className="py-4 align-top"><a href="https://theweek.com/transport/zimbabwe-driving-crisis" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[var(--accent-primary)] hover:underline">The Week <ExternalLink className="h-3 w-3" /></a></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 align-top">🇦🇺 Australia</td>
                <td className="py-4 pr-4 align-top">July 2026</td>
                <td className="py-4 pr-4">A vehicle struck a pothole on the Princes Highway, causing a serious crash that injured two people. This highlighted the ongoing danger and prompted renewed political focus.</td>
                <td className="py-4 align-top"><a href="https://www.heraldsun.com.au/news/geelong/two-taken-to-hospital-after-princes-highway-crash-amid-110kmh-push/news-story/d9da63831606b705a84d6c4cd6654182" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[var(--accent-primary)] hover:underline">Herald Sun <ExternalLink className="h-3 w-3" /></a></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 align-top">🇲🇾 Malaysia</td>
                <td className="py-4 pr-4 align-top">14 Jun 2025</td>
                <td className="py-4 pr-4">A <strong>42-year-old cyclist</strong> died after striking a pothole on Jalan Gunung Pulai in Johor, falling into the path of a gravel lorry.</td>
                <td className="py-4 align-top"><a href="https://www.straitstimes.com/asia/se-asia/accident-claims-life-of-singaporean-cyclist-in-kulai-johor" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[var(--accent-primary)] hover:underline">The Straits Times <ExternalLink className="h-3 w-3" /></a></td>
              </tr>
              <tr>
                <td className="py-4 pr-4 align-top">🇲🇾 Malaysia</td>
                <td className="py-4 pr-4 align-top">5 Apr 2025</td>
                <td className="py-4 pr-4">A <strong>19-year-old motorcyclist</strong> died after hitting a pothole on the Kuantan–Cherok Paloh road, losing control and being thrown from his motorcycle.</td>
                <td className="py-4 align-top"><a href="https://www.freemalaysiatoday.com/category/nation/2025/04/05/motorcyclist-dies-after-hitting-pothole" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[var(--accent-primary)] hover:underline">FMT <ExternalLink className="h-3 w-3" /></a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="h-5 w-5 text-orange-400" />
            <h2 className="text-lg font-semibold text-white">Other Notable Reports</h2>
          </div>
          <ul className="space-y-4 text-sm text-[var(--text-secondary)]">
            <li className="flex gap-2">
              <span className="text-[var(--accent-primary)]">•</span>
              <span><strong>United Kingdom (May 2026):</strong> <em>The Guardian</em> reported increasing injuries, deaths, and vehicle damage caused by deteriorating roads, a growing public safety issue especially for cyclists. <a href="https://www.theguardian.com/world/2026/may/31/one-day-i-thought-thats-enough-the-people-fighting-back-against-pothole-riddled-roads" target="_blank" rel="noreferrer" className="text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1">Source <ExternalLink className="h-3 w-3" /></a></span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--accent-primary)]">•</span>
              <span><strong>The AA (Automobile Association, UK):</strong> Attended <strong>643,318 pothole-related incidents in 2024</strong>, warning that potholes continue to cause serious crashes. <a href="https://www.theaa.com/about-us/newsroom/national-pothole-day-2025" target="_blank" rel="noreferrer" className="text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1">Source <ExternalLink className="h-3 w-3" /></a></span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--accent-primary)]">•</span>
              <span><strong>United Kingdom (December 2025):</strong> BBC Panorama documentary <em>"The Pothole Problem"</em> investigated injuries, fatalities, and the maintenance backlog affecting roads.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--accent-primary)]">•</span>
              <span><strong>Forbes (12 January 2024):</strong> Discussed the death of <strong>Harry Colledge</strong> while reporting on new technology designed to detect dangerous potholes before they cause fatal crashes. <a href="https://www.forbes.com/sites/carltonreid/2024/01/12/new-computer-model-plots-pothole-shocks-fatal-for-cyclists-and-costly-to-drivers/" target="_blank" rel="noreferrer" className="text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1">Source <ExternalLink className="h-3 w-3" /></a></span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--accent-primary)]">•</span>
              <span><strong>The Mirror (10 February 2024):</strong> Reported that Cycling UK estimates <strong>one cyclist is killed or seriously injured every week</strong> in pothole-related incidents. <a href="https://www.mirror.co.uk/news/uk-news/human-cost-pothole-crisis-hundreds-32058639" target="_blank" rel="noreferrer" className="text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1">Source <ExternalLink className="h-3 w-3" /></a></span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--accent-primary)]">•</span>
              <span><strong>The Telegraph (28 May 2026):</strong> Reported a sharp rise in cyclists and motorcyclists being killed or seriously injured, with deteriorating road surfaces identified as a major contributing factor. <a href="https://www.telegraph.co.uk/news/2026/05/28/potholes-blamed-surge-cyclists-serious-injuries-roads-fatal/" target="_blank" rel="noreferrer" className="text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1">Source <ExternalLink className="h-3 w-3" /></a></span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--accent-primary)]">•</span>
              <span><strong>Canada (27 Aug 2025):</strong> Global News reported that <strong>Mélanie Guindon</strong> spent a week in a coma after her bicycle hit a pothole in downtown Montreal. <a href="https://globalnews.ca/news/11352068/montreal-cyclist-coma-pothole/" target="_blank" rel="noreferrer" className="text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1">Source <ExternalLink className="h-3 w-3" /></a></span>
            </li>
          </ul>
        </section>

        <section className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Research & Statistics</h2>
          </div>
          <ul className="space-y-4 text-sm text-[var(--text-secondary)]">
            <li className="flex gap-2">
              <span className="text-[var(--accent-primary)]">•</span>
              <span><strong>U.S. Road Conditions:</strong> A 2017 research paper noted that road-related conditions contribute to approximately <strong>22,000 of the 42,000 annual traffic fatalities</strong> in the United States. Potholes are recognized as a major contributing hazard. <a href="https://arxiv.org/abs/1710.02595" target="_blank" rel="noreferrer" className="text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1">Source <ExternalLink className="h-3 w-3" /></a></span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--accent-primary)]">•</span>
              <span><strong>Vulnerable Road Users:</strong> Multiple transportation studies identify potholes as a significant risk factor for motorcyclists and cyclists due to sudden loss of control. <a href="https://arxiv.org/abs/2309.17426" target="_blank" rel="noreferrer" className="text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1">Source <ExternalLink className="h-3 w-3" /></a></span>
            </li>
          </ul>
        </section>
      </div>

      <div className="bg-gradient-to-r from-[var(--bg-surface)] to-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-2xl p-6 text-center">
        <p className="text-[var(--text-secondary)] text-sm max-w-3xl mx-auto">
          Many countries do <strong>not</strong> classify fatalities under a separate "pothole death" category, so incidents are often recorded simply as road traffic fatalities with poor road conditions listed as a contributing factor. Pothole Radar aims to empower communities to report and track these hazards before they become deadly.
        </p>
      </div>
    </motion.div>
  );
}
