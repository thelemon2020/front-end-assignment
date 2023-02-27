import './App.css';
import {AppShell, Tabs} from "@mantine/core";
import {useState} from "react";
import Search from "./Search";
import FavouritePosts from "./FavouritePosts";


function App() {
    const [activeTab, setActiveTab] = useState('search');
    const [redditIds, setRedditIds] = useState([]);

    function getStoredIds() {
        const idArray = localStorage.getItem('reddit_ids')?.split(',');
        if (idArray) {
            if (idArray[0] !== '') {
                setRedditIds(idArray);
            }
        } else {
            setRedditIds([]);
        }
    }

    return (
        <div className="App">
            <AppShell
                padding="md"
            >
                <Tabs value={activeTab} onTabChange={(value) => {
                    getStoredIds()
                    setActiveTab(value);
                }}>
                    <Tabs.List>
                        <Tabs.Tab value="search">Search Reddit Posts</Tabs.Tab>
                        <Tabs.Tab value="favourite">Favourite Reddit Posts</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="search" pt="xs">
                        <Search activeTab={activeTab}/>
                    </Tabs.Panel>

                    <Tabs.Panel value="favourite" pt="xs">
                        <FavouritePosts activeTab={activeTab} redditIds={redditIds}/>
                    </Tabs.Panel>
                </Tabs>
            </AppShell>
        </div>
    );
}

export default App;
