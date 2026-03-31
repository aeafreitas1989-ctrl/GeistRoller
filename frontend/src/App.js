import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { StorytellerPage } from "@/pages/StorytellerPage";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<StorytellerPage />} />
                </Routes>
            </BrowserRouter>
            <Toaster 
                position="top-right" 
                toastOptions={{
                    style: {
                        background: '#18181b',
                        border: '1px solid #27272a',
                        color: '#e4e4e7',
                    },
                }}
            />
        </div>
    );
}

export default App;
