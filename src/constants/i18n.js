/**
 * i18n.js — Localization system for English and Filipino.
 *
 * All user-facing strings are defined here for both languages.
 * Text is written in simple, easy-to-understand (layman's) terms.
 *
 * @module i18n
 */

export const translations = {
  en: {
    // ── General ──
    live: 'LIVE',
    usAqi: 'US AQI',
    appName: 'AirHaven',
    location: 'Kartilya ng Katipunan',

    // ── Greetings ──
    greetingMorning: 'Good Morning',
    greetingAfternoon: 'Good Afternoon',
    greetingEvening: 'Good Evening',
    greetingNight: 'Good Night',
    greetingSub: "Let's check today's air quality.",

    // ── Splash ──
    tagline: 'Know Your Air, Find Your Haven',

    // ── Onboarding ──
    onboardingTitle1: 'Know Your Air',
    onboardingSub1: 'Find Your Haven',
    onboardingBody1:
      'AirHaven monitors real-time air quality around your area so you always know what you\'re breathing.',
    onboardingTitle2: 'Live Sensor Data',
    onboardingSub2: '3 Monitoring Nodes',
    onboardingBody2:
      'Our sensor nodes measure PM2.5, PM10, CO, NO₂, and O₃ in real time — giving you accurate local readings.',
    onboardingTitle3: 'Health Insights',
    onboardingSub3: 'US EPA / DENR Standard',
    onboardingBody3:
      'Get health tips, activity safety ratings, and AQI forecasts based on official standards.',
    onboardingTitle4: 'Area Coverage',
    onboardingSub4: 'Kartilya ng Katipunan',
    onboardingBody4:
      'View a map of all sensor locations around Kartilya ng Katipunan and compare air quality across zones.',
    skip: 'Skip',
    getStarted: 'Get Started',

    // ── Dashboard ──
    dashboardOverview: 'Dashboard Overview',

    // ── Settings ──
    settings: 'Settings',
    display: 'Display',
    data: 'Data',
    about: 'About',
    language: 'Language',
    pushNotifications: 'Push Notifications',
    autoRefresh: 'Auto-Refresh Data',
    aqiStandard: 'AQI Standard',
    appVersion: 'App Version',
    monitoringArea: 'Monitoring Area',
    activeSensorNodes: 'Active Sensor Nodes',
    english: 'English',
    filipino: 'Filipino',

    // ── AQI Alert ──
    hazardousAirQuality: '🚨 HAZARDOUS AIR QUALITY',
    airQualityAlert: '⚠️ AIR QUALITY ALERT',
    detectedAcrossNetwork: 'Detected across monitoring network',
    iUnderstand: 'I Understand',
    alertSystem: 'AirHaven Alert System',

    // ── AQI Hero Card ──
    updated: 'Updated',
    primaryPollutant: 'Primary Pollutant',
    tapToCollapse: 'Tap to collapse',
    tapForBreakdown: 'Tap for pollutant breakdown',
    pollutantBreakdown: 'Pollutant Breakdown',
    breakdownSubtitle: 'AQI sub-index per pollutant — highest = main contributor',
    dominant: 'Dominant',

    // ── AQI Reference ──
    aqiLevelReference: 'AQI Level Reference',

    // ── Environment ──
    environment: 'Environment',
    temperature: 'Temperature',
    humidity: 'Humidity',
    cool: 'Cool',
    comfortable: 'Comfortable',
    warm: 'Warm',
    hot: 'Hot',
    dry: 'Dry',
    humid: 'Humid',
    veryHumid: 'Very Humid',

    // ── Full Map ──
    sensorMap: 'Sensor Map',
    nodesCount: 'nodes',
    temp: 'Temp',

    // ── Health Recommendations ──
    recommendations: 'Recommendations',
    safe: 'Safe',
    avoid: 'Avoid',

    // ── Hourly Forecast ──
    hourlyForecast: 'Hourly Forecast',
    next12h: 'Next 12h',
    now: 'Now',

    // ── Mini Map ──
    sensorNodes: 'Sensor Nodes',
    active: 'active',

    // ── Pollutants ──
    pollutants: 'Pollutants',

    // ── Pollutant Detail ──
    currentReading: 'Current Reading',
    subAqi: 'Sub-AQI',
    aqiScale: 'AQI Scale',
    aboutSection: 'About',
    sources: 'Sources',
    healthEffects: 'Health Effects',
    protection: 'Protection',

    // ── Weekly Forecast ──
    sevenDayTrend: 'Daily Forecast',
    today: 'Today',

    // ── AQI Category Labels ──
    aqiGoodLabel: 'Good',
    aqiModerateLabel: 'Moderate',
    aqiSensitiveLabel: 'Unhealthy for Sensitive Groups',
    aqiUnhealthyLabel: 'Unhealthy',
    aqiVeryUnhealthyLabel: 'Very Unhealthy',
    aqiHazardousLabel: 'Hazardous',

    // ── AQI Category Short Labels ──
    aqiGoodShort: 'Good',
    aqiModerateShort: 'Moderate',
    aqiSensitiveShort: 'Sensitive',
    aqiUnhealthyShort: 'Unhealthy',
    aqiVeryUnhealthyShort: 'V. Unhealthy',
    aqiHazardousShort: 'Hazardous',

    // ── AQI Descriptions (simplified) ──
    aqiGoodDesc: 'Air quality at KKK is excellent. No health risk for anyone.',
    aqiModerateDesc: 'Air quality is acceptable, but sensitive individuals near Padre Burgos Ave may feel mild effects.',
    aqiSensitiveDesc: 'Sensitive groups may feel effects, especially near peak traffic hours around Manila City Hall.',
    aqiUnhealthyDesc: 'Everyone around KKK may start to feel health effects. Limit outdoor time.',
    aqiVeryUnhealthyDesc: 'Health alert — all outdoor events at KKK should be suspended.',
    aqiHazardousDesc: 'Emergency conditions — remain indoors and postpone all KKK activities indefinitely.',

    // ── AQI Advice (simplified) ──
    aqiGoodAdvice: 'Great time to explore KKK, jog around the park, or join outdoor events.',
    aqiModerateAdvice: 'Most activities at KKK are fine. Sensitive groups should watch for symptoms like coughing.',
    aqiSensitiveAdvice: 'Kids, elderly, and those with asthma should reduce time outdoors near Manila City Hall/Padre Burgos Ave.',
    aqiUnhealthyAdvice: 'Limit exposure at KKK. If commuting nearby, wear an N95/KN95 mask and keep windows closed.',
    aqiVeryUnhealthyAdvice: 'Stay indoors with filtered air. Suspend all outdoor events or tours at KKK.',
    aqiHazardousAdvice: 'Remain indoors. Postpone all KKK commemorations. Wear N95 or higher if going outside is unavoidable.',

    // ── Pollutant Full Names ──
    pm25FullName: 'Fine Particles (PM2.5)',
    pm10FullName: 'Coarse Particles (PM10)',
    coFullName: 'Carbon Monoxide',
    no2FullName: 'Nitrogen Dioxide',
    o3FullName: 'Ground-Level Ozone',

    // ── Pollutant Descriptions ──
    pm25Desc:
      "PM2.5 are tiny particles in the air smaller than 2.5 micrometers. They're so small they can get deep into your lungs and even into your blood.",
    pm10Desc:
      'PM10 are particles 10 micrometers or smaller. They can get into your lungs and cause breathing problems.',
    coDesc:
      "CO is a colorless, odorless gas from incomplete burning. It reduces your blood's ability to carry oxygen.",
    no2Desc:
      'NO₂ is a reddish-brown gas with a sharp smell. It forms when fossil fuels burn at high temperatures and contributes to smog.',
    o3Desc:
      "Ground-level ozone is a harmful pollutant formed when vehicle and factory emissions react with sunlight. It's the main part of smog.",

    // ── Pollutant Sources ──
    pm25Sources: ['Vehicle exhaust', 'Factory smoke', 'Burning wood/coal', 'Dust and construction'],
    pm10Sources: ['Road dust', 'Construction sites', 'Farming operations', 'Wildfires'],
    coSources: ['Vehicle exhaust', 'Factory processes', 'Home heating', 'Cigarette smoke'],
    no2Sources: ['Vehicle emissions', 'Power plants', 'Factories', 'Construction equipment'],
    o3Sources: [
      'Not directly released — forms from vehicle/factory pollution + sunlight',
      'Highest on hot sunny days',
      'Urban areas with heavy traffic',
    ],

    // ── Pollutant Health Effects ──
    pm25Effects: ['Worse asthma', 'Weaker lungs', 'Irregular heartbeat', 'Higher risk for people with heart/lung disease'],
    pm10Effects: ['Eye, nose, and throat irritation', 'Coughing and breathing difficulty', 'Worse asthma', 'Reduced lung function'],
    coEffects: ['Headaches and dizziness', 'Less alertness', 'Chest pain in heart patients', 'Can be fatal at very high levels'],
    no2Effects: ['Airway swelling', 'Easier to catch lung infections', 'Worse asthma symptoms', 'Slower lung development in children'],
    o3Effects: ['Chest pain and coughing', 'Throat irritation', 'Worse bronchitis/asthma', 'Reduced lung function'],

    // ── Pollutant Protection ──
    pm25Protection: 'Use N95 masks when levels are high. Close windows and use air purifiers indoors.',
    pm10Protection: 'Avoid outdoor exercise when it\'s dusty. Stay indoors when levels are high.',
    coProtection: 'Make sure enclosed spaces are well ventilated. Never run engines in closed garages.',
    no2Protection: 'Limit time near busy roads. Check local air quality reports.',
    o3Protection: 'Limit outdoor activities on hot, sunny afternoons. Exercise in the morning or evening.',

    // ── Health Tips (AQI 0-50) ──
    advisory0: 'Air quality at KKK is excellent. No health risks — a perfect day to be outdoors.',
    tip0_1: 'Great conditions for everyone at KKK',
    tip0_2: 'Ideal for students and tourists exploring the park and monuments',
    tip0_3: 'Drink plenty of water while enjoying outdoor activities',
    safe0_1: 'Running and outdoor sports around KKK',
    safe0_2: 'Biking near the park perimeter',
    safe0_3: 'Walking, hiking, and monument tours',
    safe0_4: 'Outdoor play and events for kids',

    // ── Health Tips (AQI 51-100) ──
    advisory1: 'Air quality is acceptable at KKK. Most activities are safe, but sensitive groups should stay alert.',
    tip1_1: 'Outdoor activities at KKK are safe for most people',
    tip1_2: 'Sensitive groups should watch for coughing or shortness of breath',
    tip1_3: 'Drink water, especially when exercising or touring the park',
    safe1_1: 'Walking and light exercise around KKK',
    safe1_2: 'Jogging (for healthy individuals)',
    safe1_3: 'Short outdoor visits for students and tourists',
    avoid1_1: 'Strenuous outdoor exertion if you are unusually sensitive',
    avoid1_2: 'Prolonged outdoor time if you have asthma or allergies',

    // ── Health Tips (AQI 101-150) ──
    advisory2: 'Sensitive groups may feel health effects, especially near the Manila City Hall/Padre Burgos Ave perimeter. Healthy individuals can continue light activity.',
    tip2_1: 'Sensitive groups should reduce outdoor time, especially during peak traffic hours',
    tip2_2: 'Children, elderly, and those with respiratory or heart conditions should stay inside',
    tip2_3: 'Use an air purifier indoors if available',
    safe2_1: 'Light outdoor activity for healthy individuals',
    safe2_2: 'Exercise and activities indoors',
    avoid2_1: 'Prolonged or heavy outdoor exertion for sensitive groups',
    avoid2_2: 'Extended outdoor time for kids and the elderly',
    avoid2_3: 'Outdoor activity near Padre Burgos Ave during peak hours',

    // ── Health Tips (AQI 151-200) ──
    advisory3: 'Everyone near KKK may begin to feel health effects. Limit outdoor exposure and move activities indoors.',
    tip3_1: 'Stay indoors or in air-conditioned spaces; keep windows closed',
    tip3_2: 'Wear a well-fitted N95/KN95 mask if you must commute near KKK',
    tip3_3: 'Use an air purifier indoors to maintain clean air',
    safe3_1: 'Indoor activities only',
    safe3_2: 'Light indoor exercise like yoga or stretching',
    avoid3_1: 'Prolonged or intense outdoor exercise for everyone',
    avoid3_2: 'Opening windows or doors in nearby buildings',
    avoid3_3: 'Any outdoor physical activity for sensitive groups',
    avoid3_4: 'Unnecessary trips outside near KKK or Padre Burgos Ave',

    // ── Health Tips (AQI 201-500) ──
    advisory4: 'Health emergency at KKK. Serious risk for the entire population. Remain indoors and follow local public health advisories.',
    tip4_1: 'Stay indoors at all times; use HEPA air purifiers and seal windows and doors',
    tip4_2: 'Wear an N95 or higher-grade respirator if going outside is absolutely necessary',
    tip4_3: 'Postpone all outdoor commemorations and events at KKK indefinitely',
    safe4_1: 'Stay inside with filtered or purified air',
    avoid4_1: 'All outdoor physical activities without exception',
    avoid4_2: 'Opening any windows or doors',
    avoid4_3: 'Going outside until the health alert is lifted',
    avoid4_4: 'Bringing children or elderly outdoors under any circumstance',
  },

  fil: {
    // ── General ──
    live: 'LIVE',
    usAqi: 'US AQI',
    appName: 'AirHaven',
    location: 'Kartilya ng Katipunan',

    // ── Greetings ──
    greetingMorning: 'Magandang Umaga',
    greetingAfternoon: 'Magandang Hapon',
    greetingEvening: 'Magandang Gabi',
    greetingNight: 'Magandang Gabi',
    greetingSub: 'Tingnan natin ang kalidad ng hangin ngayon.',

    // ── Splash ──
    tagline: 'Alamin ang Hangin Mo, Hanapin ang Ligtas Mong Lugar',

    // ── Onboarding ──
    onboardingTitle1: 'Alamin ang Hangin Mo',
    onboardingSub1: 'Hanapin ang Ligtas Mong Lugar',
    onboardingBody1:
      'Mino-monitor ng AirHaven ang kalidad ng hangin sa iyong lugar para lagi mong alam kung ano ang nilalanghap mo.',
    onboardingTitle2: 'Live na Datos ng Sensor',
    onboardingSub2: '3 Monitoring Node',
    onboardingBody2:
      'Sinusukat ng aming mga sensor ang PM2.5, PM10, CO, NO₂, at O₃ sa real time — para sa tumpak na lokal na datos.',
    onboardingTitle3: 'Gabay sa Kalusugan',
    onboardingSub3: 'US EPA / DENR Standard',
    onboardingBody3:
      'Kumuha ng health tips, rating ng kaligtasan sa aktibidad, at AQI forecast batay sa opisyal na pamantayan.',
    onboardingTitle4: 'Sakop ng Lugar',
    onboardingSub4: 'Kartilya ng Katipunan',
    onboardingBody4:
      'Tingnan ang mapa ng lahat ng sensor sa paligid ng Kartilya ng Katipunan at ikumpara ang kalidad ng hangin sa iba\'t ibang bahagi.',
    skip: 'Laktawan',
    getStarted: 'Magsimula',

    // ── Dashboard ──
    dashboardOverview: 'Buod ng Dashboard',

    // ── Settings ──
    settings: 'Mga Setting',
    display: 'Display',
    data: 'Datos',
    about: 'Tungkol',
    language: 'Wika',
    pushNotifications: 'Push Notification',
    autoRefresh: 'Auto-Refresh ng Datos',
    aqiStandard: 'AQI Standard',
    appVersion: 'Bersyon ng App',
    monitoringArea: 'Lugar na Mino-monitor',
    activeSensorNodes: 'Aktibong Sensor Node',
    english: 'English',
    filipino: 'Filipino',

    // ── AQI Alert ──
    hazardousAirQuality: '🚨 MAPANGANIB NA KALIDAD NG HANGIN',
    airQualityAlert: '⚠️ ALERTO SA KALIDAD NG HANGIN',
    detectedAcrossNetwork: 'Na-detect sa buong monitoring network',
    iUnderstand: 'Naiintindihan Ko',
    alertSystem: 'AirHaven Alert System',

    // ── AQI Hero Card ──
    updated: 'Na-update',
    primaryPollutant: 'Pangunahing Polusyon',
    tapToCollapse: 'I-tap para i-collapse',
    tapForBreakdown: 'I-tap para sa detalye ng polusyon',
    pollutantBreakdown: 'Detalye ng mga Polusyon',
    breakdownSubtitle: 'AQI sub-index bawat polusyon — pinakamataas = pangunahing dahilan',
    dominant: 'Pangunahin',

    // ── AQI Reference ──
    aqiLevelReference: 'Gabay sa AQI Level',

    // ── Environment ──
    environment: 'Kapaligiran',
    temperature: 'Temperatura',
    humidity: 'Halumigmig',
    cool: 'Malamig',
    comfortable: 'Komportable',
    warm: 'Mainit-init',
    hot: 'Mainit',
    dry: 'Tuyo',
    humid: 'Mahalumigmig',
    veryHumid: 'Sobrang Halumigmig',

    // ── Full Map ──
    sensorMap: 'Mapa ng Sensor',
    nodesCount: 'node',
    temp: 'Temp',

    // ── Health Recommendations ──
    recommendations: 'Mga Rekomendasyon',
    safe: 'Ligtas',
    avoid: 'Iwasan',

    // ── Hourly Forecast ──
    hourlyForecast: 'Oras-oras na Forecast',
    next12h: 'Susunod na 12 oras',
    now: 'Ngayon',

    // ── Mini Map ──
    sensorNodes: 'Mga Sensor Node',
    active: 'aktibo',

    // ── Pollutants ──
    pollutants: 'Mga Polusyon',

    // ── Pollutant Detail ──
    currentReading: 'Kasalukuyang Reading',
    subAqi: 'Sub-AQI',
    aqiScale: 'AQI Scale',
    aboutSection: 'Tungkol',
    sources: 'Mga Pinagmumulan',
    healthEffects: 'Epekto sa Kalusugan',
    protection: 'Proteksyon',

    // ── Weekly Forecast ──
    sevenDayTrend: 'Pang-araw-araw na Forecast',
    today: 'Ngayon',

    // ── AQI Category Labels ──
    aqiGoodLabel: 'Mabuti',
    aqiModerateLabel: 'Katamtaman',
    aqiSensitiveLabel: 'Hindi Maganda para sa mga Sensitibo',
    aqiUnhealthyLabel: 'Hindi Maganda',
    aqiVeryUnhealthyLabel: 'Sobrang Hindi Maganda',
    aqiHazardousLabel: 'Mapanganib',

    // ── AQI Category Short Labels ──
    aqiGoodShort: 'Mabuti',
    aqiModerateShort: 'Katamtaman',
    aqiSensitiveShort: 'Sensitibo',
    aqiUnhealthyShort: 'Hindi OK',
    aqiVeryUnhealthyShort: 'Delikado',
    aqiHazardousShort: 'Mapanganib',

    // ── AQI Descriptions ──
    aqiGoodDesc: 'Napakaganda ng kalidad ng hangin sa KKK. Walang banta sa kalusugan para sa sinuman.',
    aqiModerateDesc: 'Katanggap-tanggap ang kalidad ng hangin, ngunit ang mga sensitibong indibidwal malapit sa Padre Burgos Ave ay maaaring makaranas ng bahagyang epekto.',
    aqiSensitiveDesc: 'Maaaring makaranas ng epekto ang mga sensitibong grupo, lalo na tuwing kasagsagan ng trapiko sa paligid ng Manila City Hall.',
    aqiUnhealthyDesc: 'Lahat ng nasa paligid ng KKK ay maaaring magsimulang makaramdam ng epekto sa kalusugan. Limitahan ang oras sa labas.',
    aqiVeryUnhealthyDesc: 'Babala sa kalusugan — dapat isuspinde ang lahat ng aktibidad sa labas sa KKK.',
    aqiHazardousDesc: 'Kondisyong pang-emergency — manatili sa loob at ipagpaliban ang lahat ng aktibidad sa KKK nang walang takdang panahon.',
    
    // ── AQI Advice ──
    aqiGoodAdvice: 'Napakagandang oras para libutin ang KKK, mag-jogging sa parke, o sumali sa mga aktibidad sa labas.',
    aqiModerateAdvice: 'Ayos lang ang karamihan sa mga aktibidad sa KKK. Dapat mag-ingat ang mga sensitibong grupo sa mga sintomas tulad ng pag-ubo.',
    aqiSensitiveAdvice: 'Dapat bawasan ng mga bata, matatanda, at mga may hika ang oras sa labas malapit sa Manila City Hall/Padre Burgos Ave.',
    aqiUnhealthyAdvice: 'Limitahan ang paglabas-labas sa KKK. Kung bumibiyahe sa malapit, magsuot ng N95/KN95 mask at panatilihing nakasara ang mga bintana.',
    aqiVeryUnhealthyAdvice: 'Manatili sa loob na may filtradong hangin. Isuspinde ang lahat ng outdoor event o tour sa KKK.',
    aqiHazardousAdvice: 'Manatili sa loob. Ipagpaliban ang lahat ng paggunita sa KKK. Magsuot ng N95 o mas mataas na uri ng mask kung hindi maiiwasang lumabas.',

    // ── Pollutant Full Names ──
    pm25FullName: 'Pinong Particle (PM2.5)',
    pm10FullName: 'Malalaking Particle (PM10)',
    coFullName: 'Carbon Monoxide',
    no2FullName: 'Nitrogen Dioxide',
    o3FullName: 'Ground-Level Ozone',

    // ── Pollutant Descriptions ──
    pm25Desc:
      'Ang PM2.5 ay napakaliliit na particle sa hangin na mas maliit sa 2.5 micrometer. Dahil sa liit nila, pumapasok sila sa baga at maaari pang makarating sa dugo.',
    pm10Desc:
      'Ang PM10 ay mga particle na 10 micrometer o mas maliit. Pumapasok sila sa baga at nagdudulot ng problema sa paghinga.',
    coDesc:
      'Ang CO ay gas na walang kulay at amoy mula sa hindi kumpletong pagkasunog. Nababawasan nito ang kakayahan ng dugo na magdala ng oxygen.',
    no2Desc:
      'Ang NO₂ ay mapulang-kayumangging gas na may maasim na amoy. Nabubuo ito kapag nasusunog ang fossil fuel at nagiging dahilan ng smog.',
    o3Desc:
      'Ang ground-level ozone ay masaming polusyon na nabubuo kapag ang emisyon ng sasakyan at pabrika ay nag-react sa sikat ng araw. Ito ang pangunahing sangkap ng smog.',

    // ── Pollutant Sources ──
    pm25Sources: ['Usok ng sasakyan', 'Usok ng pabrika', 'Pagsunog ng kahoy/uling', 'Alikabok at konstruksyon'],
    pm10Sources: ['Alikabok sa kalsada', 'Mga construction site', 'Pagbubungkal ng lupa', 'Sunog sa kagubatan'],
    coSources: ['Usok ng sasakyan', 'Proseso sa pabrika', 'Pag-init ng bahay', 'Usok ng sigarilyo'],
    no2Sources: ['Usok ng sasakyan', 'Power plant', 'Mga pabrika', 'Kagamitang pang-konstruksyon'],
    o3Sources: [
      'Hindi direktang inilalabas — nabubuo mula sa polusyon ng sasakyan/pabrika + araw',
      'Pinakamataas kapag mainit at maaraw',
      'Mga lugar na matrapik',
    ],

    // ── Pollutant Health Effects ──
    pm25Effects: ['Lumalala ang hika', 'Humihina ang baga', 'Hindi regular na tibok ng puso', 'Mas delikado para sa may sakit sa puso/baga'],
    pm10Effects: ['Pangangati ng mata, ilong at lalamunan', 'Pag-ubo at hirap sa paghinga', 'Lumalala ang hika', 'Humihina ang baga'],
    coEffects: ['Sakit ng ulo at pagkahilo', 'Nababawasan ang alertness', 'Sakit sa dibdib para sa may heart disease', 'Nakamamatay sa sobrang taas ng level'],
    no2Effects: ['Pamamaga ng daanan ng hangin', 'Mas madaling magkasakit sa baga', 'Lumalala ang hika', 'Naaapektuhan ang baga ng mga bata'],
    o3Effects: ['Sakit sa dibdib at pag-ubo', 'Pangangati ng lalamunan', 'Lumalala ang bronchitis/hika', 'Humihina ang baga'],

    // ── Pollutant Protection ──
    pm25Protection: 'Gumamit ng N95 mask kapag mataas ang level. Isara ang bintana at gumamit ng air purifier sa loob.',
    pm10Protection: 'Iwasan ang ehersisyo sa labas kapag maalikabok. Manatili sa loob kapag mataas ang level.',
    coProtection: 'Siguraduhin ang maayos na bentilasyon sa loob. Huwag mag-patakbo ng makina sa saradong garahe.',
    no2Protection: 'Limitahan ang oras malapit sa matatrafikong kalsada. Subaybayan ang lokal na air quality.',
    o3Protection: 'Limitahan ang outdoor activities tuwing mainit na hapon. Mag-ehersisyo sa umaga o gabi.',

    // ── Health Tips (AQI 0-50) ──
    advisory0: 'Napakaganda ng kalidad ng hangin sa KKK. Walang banta sa kalusugan — perpektong araw para lumabas.',
    tip0_1: 'Napakagandang kondisyon para sa lahat sa KKK',
    tip0_2: 'Perpekto para sa mga estudyante at turistang naglilibot sa parke at mga monumento',
    tip0_3: 'Uminom ng maraming tubig habang nag-eenjoy sa mga aktibidad sa labas',
    safe0_1: 'Pagtakbo at mga outdoor sports sa paligid ng KKK',
    safe0_2: 'Pagbibisikleta sa paligid ng parke',
    safe0_3: 'Paglalakad, hiking, at paglilibot sa mga monumento',
    safe0_4: 'Paglalaro sa labas at mga event para sa mga bata',

    // ── Health Tips (AQI 51-100) ──
    advisory1: 'Katanggap-tanggap ang kalidad ng hangin sa KKK. Ligtas ang karamihan sa mga aktibidad, ngunit dapat maging alerto ang mga sensitibong grupo.',
    tip1_1: 'Ligtas para sa karamihan ang mga aktibidad sa labas sa KKK',
    tip1_2: 'Dapat bantayan ng mga sensitibong grupo ang pag-ubo o hirap sa paghinga',
    tip1_3: 'Uminom ng tubig, lalo na kapag nag-eehersisyo o naglilibot sa parke',
    safe1_1: 'Paglalakad at magaan na ehersisyo sa paligid ng KKK',
    safe1_2: 'Pagja-jogging (para sa mga malulusog na indibidwal)',
    safe1_3: 'Maikling pagbisita sa labas para sa mga estudyante at turista',
    avoid1_1: 'Matinding pagpapagod sa labas kung ikaw ay labis na sensitibo',
    avoid1_2: 'Matagal na oras sa labas kung mayroon kang hika o allergy',

    // ── Health Tips (AQI 101-150) ──
    advisory2: 'Maaaring makaramdam ng epekto sa kalusugan ang mga sensitibong grupo, lalo na malapit sa paligid ng Manila City Hall/Padre Burgos Ave. Maaaring ipagpatuloy ng mga malulusog na indibidwal ang magaan na aktibidad.',
    tip2_1: 'Dapat bawasan ng mga sensitibong grupo ang oras sa labas, lalo na tuwing kasagsagan ng trapiko',
    tip2_2: 'Dapat manatili sa loob ang mga bata, matatanda, at mga may kondisyon sa paghinga o puso',
    tip2_3: 'Gumamit ng air purifier sa loob kung mayroon',
    safe2_1: 'Magaan na aktibidad sa labas para sa mga malulusog na indibidwal',
    safe2_2: 'Pag-eehersisyo at mga aktibidad sa loob',
    avoid2_1: 'Matagal o matinding pagpapagod sa labas para sa mga sensitibong grupo',
    avoid2_2: 'Matagal na oras sa labas para sa mga bata at matatanda',
    avoid2_3: 'Aktibidad sa labas malapit sa Padre Burgos Ave tuwing kasagsagan ng trapiko',

    // ── Health Tips (AQI 151-200) ──
    advisory3: 'Lahat ng nasa paligid ng KKK ay maaaring magsimulang makaramdam ng epekto sa kalusugan. Limitahan ang paglabas at ilipat ang mga aktibidad sa loob.',
    tip3_1: 'Manatili sa loob o sa mga air-conditioned na lugar; panatilihing nakasara ang mga bintana',
    tip3_2: 'Magsuot ng maayos na N95/KN95 mask kung kailangang bumiyahe malapit sa KKK',
    tip3_3: 'Gumamit ng air purifier sa loob upang mapanatiling malinis ang hangin',
    safe3_1: 'Mga aktibidad sa loob lamang',
    safe3_2: 'Magaan na ehersisyo sa loob tulad ng yoga o stretching',
    avoid3_1: 'Matagal o matinding pag-eehersisyo sa labas para sa lahat',
    avoid3_2: 'Pagbubukas ng mga bintana o pinto sa mga malalapit na gusali',
    avoid3_3: 'Anumang pisikal na aktibidad sa labas para sa mga sensitibong grupo',
    avoid3_4: 'Mga hindi kinakailangang paglabas malapit sa KKK o Padre Burgos Ave',

    // ── Health Tips (AQI 201-500) ──
    advisory4: 'Emerhensiyang pangkalusugan sa KKK. Seryosong panganib para sa buong populasyon. Manatili sa loob at sundin ang mga abiso ng lokal na awtoridad sa kalusugan.',
    tip4_1: 'Manatili sa loob sa lahat ng oras; gumamit ng mga HEPA air purifier at isara nang maigi ang mga bintana at pinto',
    tip4_2: 'Magsuot ng N95 o mas mataas na uri ng respirator kung talagang kinakailangang lumabas',
    tip4_3: 'Ipagpaliban ang lahat ng paggunita at event sa labas sa KKK nang walang takdang panahon',
    safe4_1: 'Manatili sa loob na may filtrado o puripikadong hangin',
    avoid4_1: 'Lahat ng pisikal na aktibidad sa labas nang walang pagbubukod',
    avoid4_2: 'Pagbubukas ng anumang bintana o pinto',
    avoid4_3: 'Paglabas hanggang sa alisin ang babala sa kalusugan',
    avoid4_4: 'Pagdadala sa labas ng mga bata o matatanda sa anumang sitwasyon',
  },
};

/* ── AQI Category translation helper ── */

const CAT_KEY_MAP = {
  Good: 'aqiGood',
  Moderate: 'aqiModerate',
  'Unhealthy for Sensitive Groups': 'aqiSensitive',
  Unhealthy: 'aqiUnhealthy',
  'Very Unhealthy': 'aqiVeryUnhealthy',
  Hazardous: 'aqiHazardous',
};

/**
 * Return a copy of the AQI category object with translated
 * label, shortLabel, description, and advice.
 */
export const translateCategory = (cat, t) => {
  if (!cat) return cat;
  const base = CAT_KEY_MAP[cat.label];
  if (!base) return cat;
  return {
    ...cat,
    label: t(base + 'Label'),
    shortLabel: t(base + 'Short'),
    description: t(base + 'Desc'),
    advice: t(base + 'Advice'),
  };
};

/* ── Localized health advisory ── */

/**
 * Returns a fully translated health advisory object for the given AQI.
 */
export const getLocalizedAdvisory = (aqi, t) => {
  const tipsData = [
    {
      maxAqi: 50,
      advisory: t('advisory0'),
      tips: [
        { icon: 'heart-pulse', text: t('tip0_1') },
        { icon: 'window-open-variant', text: t('tip0_2') },
        { icon: 'water', text: t('tip0_3') },
      ],
      safe: [
        { icon: 'run', text: t('safe0_1') },
        { icon: 'bike', text: t('safe0_2') },
        { icon: 'walk', text: t('safe0_3') },
        { icon: 'baby-carriage', text: t('safe0_4') },
      ],
      avoid: [],
    },
    {
      maxAqi: 100,
      advisory: t('advisory1'),
      tips: [
        { icon: 'walk', text: t('tip1_1') },
        { icon: 'account-alert', text: t('tip1_2') },
        { icon: 'water', text: t('tip1_3') },
      ],
      safe: [
        { icon: 'walk', text: t('safe1_1') },
        { icon: 'run', text: t('safe1_2') },
        { icon: 'baby-carriage', text: t('safe1_3') },
      ],
      avoid: [
        { icon: 'lungs', text: t('avoid1_1') },
        { icon: 'account-alert', text: t('avoid1_2') },
      ],
    },
    {
      maxAqi: 150,
      advisory: t('advisory2'),
      tips: [
        { icon: 'lungs', text: t('tip2_1') },
        { icon: 'account-group', text: t('tip2_2') },
        { icon: 'air-filter', text: t('tip2_3') },
      ],
      safe: [
        { icon: 'walk', text: t('safe2_1') },
        { icon: 'home', text: t('safe2_2') },
      ],
      avoid: [
        { icon: 'run', text: t('avoid2_1') },
        { icon: 'baby-carriage', text: t('avoid2_2') },
        { icon: 'lungs', text: t('avoid2_3') },
      ],
    },
    {
      maxAqi: 200,
      advisory: t('advisory3'),
      tips: [
        { icon: 'home', text: t('tip3_1') },
        { icon: 'air-filter', text: t('tip3_2') },
        { icon: 'face-mask', text: t('tip3_3') },
      ],
      safe: [
        { icon: 'home', text: t('safe3_1') },
        { icon: 'yoga', text: t('safe3_2') },
      ],
      avoid: [
        { icon: 'run', text: t('avoid3_1') },
        { icon: 'window-open-variant', text: t('avoid3_2') },
        { icon: 'baby-carriage', text: t('avoid3_3') },
        { icon: 'walk', text: t('avoid3_4') },
      ],
    },
    {
      maxAqi: 500,
      advisory: t('advisory4'),
      tips: [
        { icon: 'home', text: t('tip4_1') },
        { icon: 'face-mask', text: t('tip4_2') },
        { icon: 'window-closed-variant', text: t('tip4_3') },
      ],
      safe: [{ icon: 'home', text: t('safe4_1') }],
      avoid: [
        { icon: 'run', text: t('avoid4_1') },
        { icon: 'window-open-variant', text: t('avoid4_2') },
        { icon: 'walk', text: t('avoid4_3') },
        { icon: 'baby-carriage', text: t('avoid4_4') },
      ],
    },
  ];

  for (const set of tipsData) {
    if (aqi <= set.maxAqi) return set;
  }
  return tipsData[tipsData.length - 1];
};

/* ── Localized pollutant details ── */

/**
 * Returns translated pollutant detail info for the modal.
 */
export const getLocalizedPollutantDetail = (key, t) => {
  const details = {
    pm25: {
      fullName: t('pm25FullName'),
      description: t('pm25Desc'),
      sources: t('pm25Sources'),
      healthEffects: t('pm25Effects'),
      protection: t('pm25Protection'),
    },
    pm10: {
      fullName: t('pm10FullName'),
      description: t('pm10Desc'),
      sources: t('pm10Sources'),
      healthEffects: t('pm10Effects'),
      protection: t('pm10Protection'),
    },
    co: {
      fullName: t('coFullName'),
      description: t('coDesc'),
      sources: t('coSources'),
      healthEffects: t('coEffects'),
      protection: t('coProtection'),
    },
    no2: {
      fullName: t('no2FullName'),
      description: t('no2Desc'),
      sources: t('no2Sources'),
      healthEffects: t('no2Effects'),
      protection: t('no2Protection'),
    },
    o3: {
      fullName: t('o3FullName'),
      description: t('o3Desc'),
      sources: t('o3Sources'),
      healthEffects: t('o3Effects'),
      protection: t('o3Protection'),
    },
  };
  return details[key] || null;
};