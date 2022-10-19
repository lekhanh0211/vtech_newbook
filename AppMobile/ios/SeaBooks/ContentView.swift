//
//  ContentView.swift
//  SeaBooks
//
//  Created by Vu Huu Ninh on 10/2/22.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationView{
            SwiftUIWebView(url: URL(string: "https://m.seabook.vn"))
                //.statusBar(hidden: true)
        }
        
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
