export interface WeatherContent {
    cod: number;
    name: string;
    id: number;
    dt: number;
    main: MainWeatherData;
}

export interface MainWeatherData{
    grnd_level: number;
    humidity: number;
    pressure: number;
    sea_level: number;
    temp: number;
    temp_max: number;
    temp_min: number;
}